import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { handleToaster } from "../../functions/handleToaster";
import { handleApiError } from "../../utils/errorHandler";
import type { AppDispatch } from "../../store/store";
import { createDriver, updateDriver, getDrivers } from "../../store/driversSlice";
import type { DriverFormTypes } from "../../types/forms";

const useDriverSubmit = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation("forms/driver_form");

  const addDriver = async (values: DriverFormTypes & { 
    photoFile?: File | null;
    documents?: { [key: string]: File | null };
  }) => {
    try {
      const formData = new FormData();
      
      // Add all form fields to FormData
      Object.entries(values).forEach(([key, value]) => {
        if (key !== 'photoFile' && key !== 'documents' && value !== null && value !== undefined && value !== '') {
          formData.append(key, value as string);
        }
      });

      // Add photo file if provided
      if (values.photoFile && values.photoFile instanceof File) {
        formData.append('photo', values.photoFile);
      }

      // Add documents if provided
      if (values.documents) {
        Object.entries(values.documents).forEach(([docType, file], index) => {
          if (file && file instanceof File) {
            formData.append(`documents[${index}][file]`, file);
            formData.append(`documents[${index}][type]`, docType);
          }
        });
      }

      await dispatch(createDriver(formData as any)).unwrap();
      handleToaster({ msg: t("add_submit_success", { defaultValue: "Driver created successfully" }), status: "success" });
      // Refresh drivers list
      dispatch(getDrivers({ page: 1, limit: 10 }));
      navigate(`${import.meta.env.VITE_DRIVERS_ROUTE}`);
    } catch (error: any) {
      handleApiError(error, {
        action: "create",
        entity: "driver",
        namespace: "forms/driver_form",
      });
    }
  };

  const editDriver = async (values: DriverFormTypes & { 
    photoFile?: File | null;
    documents?: { [key: string]: File | null };
  }) => {
    try {
      if (!id) {
        handleToaster({ 
          msg: t("edit_submit_error", { defaultValue: "Driver ID is required" }), 
          status: "error" 
        });
        return;
      }

      const formData = new FormData();
      
      // Add all form fields to FormData
      Object.entries(values).forEach(([key, value]) => {
        if (key !== 'photoFile' && key !== 'documents' && value !== null && value !== undefined && value !== '') {
          formData.append(key, value as string);
        }
      });

      // Add photo file if provided
      if (values.photoFile && values.photoFile instanceof File) {
        formData.append('photo', values.photoFile);
      } else if (!values.photo_url) {
        // If no new photo and photo_url is null (user removed it via PhotoUpload), remove the photo
        formData.append('remove_photo', '1');
      }

      // Add documents if provided
      if (values.documents) {
        Object.entries(values.documents).forEach(([docType, file], index) => {
          if (file && file instanceof File) {
            formData.append(`documents[${index}][file]`, file);
            formData.append(`documents[${index}][type]`, docType);
          }
        });
      }

      await dispatch(updateDriver({ id: +id, data: formData as any })).unwrap();
      handleToaster({ msg: t("edit_submit_success", { defaultValue: "Driver updated successfully" }), status: "success" });
      navigate(`${import.meta.env.VITE_DRIVERS_ROUTE}/${id}`);
    } catch (error: any) {
      handleApiError(error, {
        action: "update",
        entity: "driver",
        namespace: "forms/driver_form",
      });
    }
  };

  return { addDriver, editDriver };
};

export default useDriverSubmit;

