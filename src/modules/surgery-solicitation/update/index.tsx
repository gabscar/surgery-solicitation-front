import { useEffect, useState } from "react";
import { SurgerySolicitationForm } from "../components/form";
import useSurgerySolicitationsRequests from "@src/lib/services/surgery-solicitation";
import { SurgerySolicitationEntity } from "@src/lib/interfaces/surgery-solicitation";
import { ICreateSurgerySolicitationParams } from "@src/lib/services/surgery-solicitation/interfaces";
import { getChangedValuesInObject } from "@src/utils/get-changed-values";
import { Spin } from "antd";
import toast from "react-hot-toast";

export const UpdateSolicitation: React.FC<{ id: string }> = (params) => {
    const { getSurgerySolicitation, updateSurgerySolicitation, loading } =
        useSurgerySolicitationsRequests();
    const [formValues, setFormValues] = useState<
        SurgerySolicitationEntity | undefined
    >(undefined);

    const getSurgeryData = async () => {
        await getSurgerySolicitation({
            requestParams: {
                id: params.id,
            },
            successCallback: (value) => {
                if (value) setFormValues(value);
            },
            errorCallback: () => {
                toast.error("Erro ao atualizar solicitação");
            },
        });
    };
    useEffect(() => {
        setFormValues(undefined);
        getSurgeryData();
    }, [params.id]);

    const onUpdateForm = async (value: ICreateSurgerySolicitationParams) => {
        const changedValues = getChangedValuesInObject(value, formValues);
        await updateSurgerySolicitation({
            requestParams: { id: params.id, ...changedValues },
            successCallback: () => {},
            errorCallback: () => {},
        });
    };
    return formValues && !loading.get ? (
        <SurgerySolicitationForm
            data={formValues}
            submitFormText="Atualizar"
            onSubmit={onUpdateForm}
            loading={loading.update}
        />
    ) : (
        <>
            <Spin />
        </>
    );
};
