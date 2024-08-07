import "./MainPatient.scss";
import MedicationCard from "../MedicationCard/MedicationCard";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PatientAPI from "../../classes/patientAPI";
import Spinner from "../Spinner/Spinner";

export default function Patient({ patient }) {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/medication/${patient.id}/add`);
  };

  useEffect(() => {
    const getMedications = async () => {
      try {
        const medData = await PatientAPI.findMedicationsByPatient(patient.id);
        const currentDate = new Date();
        const sortedMeds = medData
          .filter((med) => {
            const medDate = new Date(med.date);
            return medDate > currentDate || med.quantity > 0;
          })
          .sort((a, b) => {
            const timeA = new Date(`1970-01-01T${a.med_time}:00`);
            const timeB = new Date(`1970-01-01T${b.med_time}:00`);
            return timeA.getTime() - timeB.getTime();
          });
        setMedications(sortedMeds);
      } catch (error) {
        console.error("Unable to get medications for patient with that id");
      }
      setLoading(false);
    };
    getMedications();
  }, [patient.id]);

  const handleNavigate = () => {
    navigate(`profile/details/${patient.id}`);
  };

  return (
    <div className="patient">
      <h2 className="patient__title" onClick={handleNavigate}>
        For {patient.patient_name}:
      </h2>
      <div className="patient__medlist">
        {loading ? (
          <Spinner/>
        ) : medications.length > 0 ? (
          medications.map((medication) => (
            <MedicationCard
              key={`${medication.id}-${medication.med_time}`}
              medication={medication}
            />
          ))
        ) : (
          <p>No active medications</p>
        )}
      </div>
      <button className="patient__button" onClick={handleClick}>
        add a new medication
      </button>
    </div>
  );
}
