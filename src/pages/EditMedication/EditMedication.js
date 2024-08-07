import MedicationForm from "../../components/MedicationForm/MedicationForm";
import "./EditMedication.scss";
import MedicationAPI from "../../classes/medicationAPI";
import PatientAPI from "../../classes/patientAPI";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditMedication() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const getMedication = async () => {
      try {
        const medData = await MedicationAPI.getSingleMedication(id);
        setInitialData(medData || {});
      } catch (error) {
        console.error("Unable to get medication:", error);
      }
    };

    getMedication();
  }, [id]);

  useEffect(() => {
    const getPatients = async () => {
      try {
        const allPatients = await PatientAPI.getPatients();
        setPatients(allPatients || []);
      } catch (error) {
        console.error("Unable to get patients:", error);
      }
    };

    getPatients();
  }, []);

  useEffect(() => {
    if (initialData && patients.length > 0) {
      const patient = patients.find(
        (p) => p.patient_name === initialData.patient_name
      );
      if (patient) {
        setPatientId(patient.id);
      }
    }
  }, [initialData, patients]);

  const handleDeleteButton = async () => {
    try {
      await MedicationAPI.deleteMedication(id);
      navigate("/");
    } catch (error) {
      console.error("Unable to delete medication:", error);
    }
  };

  const handleBack = () => {
    navigate(`/medication/${id}`);
  };

  const convertTimeTo24HourFormat = (time) => {
    const [hour, minute, period] = time.split(/[:\s]/);
    let convertedHour = parseInt(hour, 10);
    if (period && period.toUpperCase() === "PM" && convertedHour < 12) {
      convertedHour += 12;
    }
    const paddedHour = convertedHour.toString().padStart(2, "0");
    return `${paddedHour}:${minute}`;
  };

  const handleSubmit = async (formData) => {
    try {
      const convertedTimes = formData.schedule.map((entry) => ({
        ...entry,
        med_time: convertTimeTo24HourFormat(entry.med_time),
      }));

      const updatedFormData = {
        ...formData,
        schedule: convertedTimes,
      };
      await MedicationAPI.updateMedication(id, updatedFormData);
      navigate(`/medication/${id}`);
    } catch (error) {
      console.error("Unable to update medication:", error);
    }
  };

  return (
    initialData && (
      <div className="page-edit-med">
        <MedicationForm
          className="edit-med"
          title="Edit Medication"
          buttonName="submit"
          buttonSecond="delete"
          initialData={initialData}
          onSubmit={handleSubmit}
          patientId={patientId}
          handleBack={handleBack}
          handleDeleteButton={handleDeleteButton}
          isEdit={true}
        />
      </div>
    )
  );
}
