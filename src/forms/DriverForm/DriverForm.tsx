import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input/Input";
import PhoneNumberInput from "../../components/PhoneNumberInput/PhoneNumberInput";
import SubmitButton from "../../components/SubmitButton/SubmitButton";
import { useFormsStore } from "../../globals/formsStore";
import { BasicButton } from "../../mui/buttons/BasicButton";
import PhotoUpload from "../../components/common/PhotoUpload/PhotoUpload";
import FormSection from "../../components/common/FormSection/FormSection";
import DocumentUpload from "../../components/common/DocumentUpload/DocumentUpload";
import type { FormiksTypes, DriverFormTypes } from "../../types/forms";
import type { DocumentType } from "../../types/enums";
import {
  DRIVER_STATUSES,
  DRIVER_AVAILABILITY_STATUSES,
} from "../../types/enums";

const DriverForm = ({
  formik,
  type,
  photoFileRef,
  documentsRef,
}: FormiksTypes<DriverFormTypes> & {
  type?: "addDriver" | "editDriver";
  photoFileRef?: React.MutableRefObject<File | null>;
  documentsRef?: React.MutableRefObject<{ [key: string]: File | null }>;
}) => {
  const { t } = useTranslation("forms/driver_form");
  const isLoading = useFormsStore((state) => state.isLoading);
  const navigate = useNavigate();
  const isEdit = type === "editDriver";
  
  // State to track document files
  const [documents, setDocuments] = useState<{ [key: string]: File | null }>({});

  const handleDocumentChange = (file: File | null, docType: string) => {
    const updated = {
      ...documents,
      [docType]: file
    };
    setDocuments(updated);
    // Update ref if provided
    if (documentsRef) {
      documentsRef.current = updated;
    }
  };

  // Document types that can be uploaded
  const documentTypes: { type: DocumentType; label: string }[] = [
    { type: 'drivers_license', label: t("documents.driversLicense", { defaultValue: "Driver's License" }) },
    { type: 'vehicle_registration', label: t("documents.vehicleRegistration", { defaultValue: "Vehicle Registration" }) },
    { type: 'insurance_certificate', label: t("documents.insuranceCertificate", { defaultValue: "Insurance Certificate" }) },
    { type: 'background_check', label: t("documents.backgroundCheck", { defaultValue: "Background Check" }) },
    { type: 'drug_test', label: t("documents.drugTest", { defaultValue: "Drug Test" }) },
    { type: 'vehicle_inspection', label: t("documents.vehicleInspection", { defaultValue: "Vehicle Inspection" }) },
    { type: 'identity_proof', label: t("documents.identityProof", { defaultValue: "Identity Proof" }) },
    { type: 'address_proof', label: t("documents.addressProof", { defaultValue: "Address Proof" }) },
    { type: 'medical_certificate', label: t("documents.medicalCertificate", { defaultValue: "Medical Certificate" }) },
    { type: 'commercial_license', label: t("documents.commercialLicense", { defaultValue: "Commercial License" }) },
    { type: 'vehicle_permit', label: t("documents.vehiclePermit", { defaultValue: "Vehicle Permit" }) },
    { type: 'other', label: t("documents.other", { defaultValue: "Other Document" }) },
  ];

  return (
    <Box className="grid justify-stretch items-start gap-6">
      {/* User Information Section */}
      <FormSection title={t("userInformation", { defaultValue: "User Information" })}>
        <Box className="grid justify-stretch items-start grid-cols-2 md:grid-cols-1 gap-5">
          <PhotoUpload
            value={isEdit ? formik.values.photo_url : undefined}
            photoFileRef={photoFileRef}
            formik={formik}
            name="name"
            onRemove={() => {
              if (isEdit) {
                formik.setFieldValue("photo_url", null);
              }
            }}
          />
          <Input
            formik={formik}
            label={t("name", { defaultValue: "Name" })}
            name="name"
            placeholder={t("namePlaceholder", { defaultValue: "Enter name" })}
            optional={!!formik.values.user_id}
          />
          <Input
            formik={formik}
            label={t("email", { defaultValue: "Email" })}
            name="email"
            type="email"
            placeholder={t("emailPlaceholder", { defaultValue: "Enter email" })}
            optional={!!formik.values.user_id}
          />
          <PhoneNumberInput
            value={formik.values.phone || ""}
            formik={formik}
            label={t("phoneNumber", { defaultValue: "Phone" })}
            name="phone"
            optional
          />
          {!isEdit && !formik.values.user_id && (
            <>
              <Input
                formik={formik}
                label={t("password", { defaultValue: "Password" })}
                name="password"
                type="password"
                placeholder={t("passwordPlaceholder", { defaultValue: "Enter password" })}
              />
              <Input
                formik={formik}
                label={t("passwordConfirmation", { defaultValue: "Confirm Password" })}
                name="password_confirmation"
                type="password"
                placeholder={t("passwordConfirmationPlaceholder", { defaultValue: "Confirm password" })}
              />
            </>
          )}
          <Input
            formik={formik}
            label={t("dateOfBirth", { defaultValue: "Date of Birth" })}
            name="date_of_birth"
            type="date"
            optional
          />
          <Input
            formik={formik}
            label={t("gender", { defaultValue: "Gender" })}
            name="gender"
            select
            options={["male", "female", "other"]}
            values={["male", "female", "other"]}
            placeholder={t("genderPlaceholder", { defaultValue: "Select gender" })}
            optional
          />
        </Box>
      </FormSection>

      {/* Driver Information Section */}
      <FormSection title={t("driverInformation", { defaultValue: "Driver Information" })}>
        <Box className="grid justify-stretch items-start grid-cols-2 md:grid-cols-1 gap-5">
          <Input
            formik={formik}
            label={t("licenseNumber", { defaultValue: "License Number" })}
            name="license_number"
            placeholder={t("licenseNumberPlaceholder", { defaultValue: "Enter license number" })}
            optional
          />
          <Input
            formik={formik}
            label={t("licenseClass", { defaultValue: "License Class" })}
            name="license_class"
            placeholder={t("licenseClassPlaceholder", { defaultValue: "Enter license class" })}
            optional
          />
          <Input
            formik={formik}
            label={t("licenseType", { defaultValue: "License Type" })}
            name="license_type"
            placeholder={t("licenseTypePlaceholder", { defaultValue: "Enter license type" })}
            optional
          />
          <Input
            formik={formik}
            label={t("licenseIssueDate", { defaultValue: "License Issue Date" })}
            name="license_issue_date"
            type="date"
            optional
          />
          <Input
            formik={formik}
            label={t("licenseExpiryDate", { defaultValue: "License Expiry Date" })}
            name="license_expiry_date"
            type="date"
            optional
          />
          <Input
            formik={formik}
            label={t("licenseIssuingState", { defaultValue: "License Issuing State" })}
            name="license_issuing_state"
            placeholder={t("licenseIssuingStatePlaceholder", { defaultValue: "Enter issuing state" })}
            optional
          />
          <Input
            formik={formik}
            label={t("licenseIssuingCountry", { defaultValue: "License Issuing Country" })}
            name="license_issuing_country"
            placeholder={t("licenseIssuingCountryPlaceholder", { defaultValue: "Enter issuing country" })}
            optional
          />
        </Box>
      </FormSection>

      {/* Emergency Contact Section */}
      <FormSection title={t("emergencyContact", { defaultValue: "Emergency Contact" })}>
        <Box className="grid justify-stretch items-start grid-cols-2 md:grid-cols-1 gap-5">
          <Input
            formik={formik}
            label={t("emergencyContactName", { defaultValue: "Emergency Contact Name" })}
            name="emergency_contact_name"
            placeholder={t("emergencyContactNamePlaceholder", { defaultValue: "Enter emergency contact name" })}
            optional
          />
          <PhoneNumberInput
            value={formik.values.emergency_contact_phone || ""}
            formik={formik}
            label={t("emergencyContactPhone", { defaultValue: "Emergency Contact Phone" })}
            name="emergency_contact_phone"
            optional
          />
        </Box>
      </FormSection>

      {/* Status Section */}
      <FormSection title={t("status", { defaultValue: "Status" })}>
        <Box className="grid justify-stretch items-start grid-cols-2 md:grid-cols-1 gap-5">
          <Input
            formik={formik}
            label={t("driverStatus", { defaultValue: "Driver Status" })}
            name="status"
            select
            options={DRIVER_STATUSES}
            values={DRIVER_STATUSES}
            placeholder={t("driverStatusPlaceholder", { defaultValue: "Select status" })}
            optional
          />
          <Input
            formik={formik}
            label={t("availabilityStatus", { defaultValue: "Availability Status" })}
            name="availability_status"
            select
            options={DRIVER_AVAILABILITY_STATUSES}
            values={DRIVER_AVAILABILITY_STATUSES}
            placeholder={t("availabilityStatusPlaceholder", { defaultValue: "Select availability" })}
            optional
          />
        </Box>
      </FormSection>

      {/* Documents Section */}
      <FormSection title={t("documents", { defaultValue: "Documents" })}>
        <Box className="grid justify-stretch items-start grid-cols-1 gap-6">
          <Typography variant="body2" className="!text-gray-600 !mb-2">
            {t("documentsDescription", { defaultValue: "Upload driver documents. All documents are optional." })}
          </Typography>
          {documentTypes.map((doc) => (
            <DocumentUpload
              key={doc.type}
              type={doc.type}
              label={doc.label}
              onChange={handleDocumentChange}
              value={documents[doc.type] || null}
            />
          ))}
        </Box>
      </FormSection>

      {/* Action Buttons */}
      <Paper className="paper !bg-gray-50">
        <Box className="flex justify-end items-center gap-4 flex-wrap">
          <BasicButton
            type="button"
            onClick={() => navigate(`${import.meta.env.VITE_DRIVERS_ROUTE}`)}
            className="!min-w-[120px] !px-6 !py-2.5 hover:!shadow-md transition-all"
          >
            {t("cancel", { defaultValue: "Cancel" })}
          </BasicButton>
          <SubmitButton
            variant="gradient"
            loading={isLoading}
            className="!min-w-[120px] !px-6 !py-2.5 hover:!shadow-lg transition-all"
          >
            {t("save", { defaultValue: "Save Changes" })}
          </SubmitButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default DriverForm;

