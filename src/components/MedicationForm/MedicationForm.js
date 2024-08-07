import { useState, useEffect } from "react";
import "./MedicationForm.scss";
import { useParams } from "react-router-dom";
import backArrow from "../../assets/icons/back-arrow.png";
import DeleteAlert from "../DeleteAlert/DeleteAlert";

export default function MedicationForm({
  className,
  title,
  buttonName,
  buttonSecond,
  handleSecond,
  handleBack,
  initialData,
  handleDeleteButton,
  onSubmit,
  isEdit,
  patientId: propPatientId,
}) {
  const { patientId: urlPatientId } = useParams();
  const patientId = propPatientId !== undefined ? propPatientId : urlPatientId;

  const scheduleOptions = [
    { label: "once a day", times: 1 },
    { label: "twice a day", times: 2 },
    { label: "three times a day", times: 3 },
    { label: "four times a day", times: 4 },
  ];

  const [medicationName, setMedicationName] = useState("");
  const [dose, setDose] = useState("");
  const [notes, setNotes] = useState("");
  const [quantity, setQuantity] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [selectedTimes, setSelectedTimes] = useState(null);
  const [times, setTimes] = useState([]);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [errors, setErrors] = useState("");

  useEffect(() => {
    if (initialData) {
      setMedicationName(initialData.med_name || "");
      setDose(initialData.med_dose || "");
      setNotes(initialData.notes || "");
      setQuantity(initialData.quantity || 0);
      const schedule = scheduleOptions.find(
        (option) => option.times === initialData.schedule.length
      );
      setSelectedSchedule(schedule ? schedule.label : "");
      setSelectedTimes(schedule ? schedule.times : null);
      setTimes(initialData.schedule.map((entry) => entry.med_time) || []);
    }
  }, [initialData]);

  const handleScheduleChange = (event) => {
    const selectedOption = scheduleOptions.find(
      (option) => option.label === event.target.value
    );
    setSelectedSchedule(event.target.value);
    setSelectedTimes(selectedOption ? selectedOption.times : null);
    setTimes(Array(selectedOption ? selectedOption.times : 0).fill(""));
    setErrors((prevErrors) => ({ ...prevErrors, selectedSchedule: "" }));
  };

  const handleTimeChange = (index, value) => {
    const newTimes = [...times];
    newTimes[index] = value;
    setTimes(newTimes);
    setErrors((prevErrors) => ({ ...prevErrors, [`time-${index}`]: "" }));
  };

  const handleSecondClick = (event) => {
    event.preventDefault();
    setShowDeleteAlert(true);
  };

  const handleHideDeleteAlert = (event) => {
    event.preventDefault();
    setShowDeleteAlert(false);
  };

  const validateFields = () => {
    const newErrors = {};
    if (!medicationName)
      newErrors.medicationName = "Medication name is required.";
    if (!dose) newErrors.dose = "Dose is required.";
    if (!selectedSchedule) newErrors.selectedSchedule = "Schedule is required.";
    if (!quantity) newErrors.quantity = "Quantity is required.";
    if (quantity < 1) newErrors.quantity = "Quantity cannot be less than 1.";
    if (quantity > 1024) newErrors.quantity = "Quantity cannot exceed 1024.";
    times.forEach((time, index) => {
      if (!time) newErrors[`time-${index}`] = `Time ${index + 1} is required.`;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateFields()) return;

    const formData = {
      patient_id: patientId,
      med_name: medicationName,
      med_dose: dose,
      quantity,
      notes,
      schedule: times.map((time) => ({ med_time: time, med_taken: false })),
    };
    onSubmit(formData);
  };

  const generateTimeOptions = (interval) => {
    const options = [];
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 0, 0);

    while (start <= end) {
      const hours = start.getHours().toString().padStart(2, "0");
      const minutes = start.getMinutes().toString().padStart(2, "0");
      options.push(`${hours}:${minutes}`);
      start.setMinutes(start.getMinutes() + interval);
    }

    return options;
  };

  const renderTimeInputs = () => {
    if (selectedTimes === null) return null;
    const timeOptions = generateTimeOptions(15);
    const inputs = [];
    for (let i = 0; i < selectedTimes; i++) {
      inputs.push(
        <div key={i} className={`${className}__time`}>
          <label className={`${className}__label`}>Time {i + 1}</label>
          <select
            id={`time-${i}`}
            name={`time-${i}`}
            className={
              errors[`time-${i}`]
                ? `${className}__input ${className}__input-time ${className}__input-error`
                : `${className}__input ${className}__input-time `
            }
            value={times[i]}
            onChange={(e) => handleTimeChange(i, e.target.value)}
          >
            <option value="" hidden>
              Please select a time
            </option>
            {timeOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors[`time-${i}`] && (
            <div className={`${className}__error`}>{errors[`time-${i}`]}</div>
          )}
        </div>
      );
    }
    return inputs;
  };

  return (
    <div className={className}>
      <div className={`${className}__wrap`}>
        <div className={`${className}__header`}>
          <img
            src={backArrow}
            alt="back arrow"
            onClick={handleBack}
            className={`${className}__arrow`}
          />
          <h2 className={`${className}__title`}>{title}</h2>
        </div>{" "}
        <form className={`${className}__form`} onSubmit={handleSubmit}>
          <div className={`${className}__box`}>
            <label className={`${className}__label`}>Medication Name</label>
            <input
              placeholder="Please enter the medication name"
              id="medicationName"
              name="medicationName"
              maxLength={16}
              className={
                errors.medicationName
                  ? `${className}__input ${className}__input-error`
                  : `${className}__input`
              }
              value={medicationName}
              onChange={(e) => {
                setMedicationName(e.target.value);
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  medicationName: "",
                }));
              }}
            />
            {errors.medicationName && (
              <div className={`${className}__error`}>
                {errors.medicationName}
              </div>
            )}
          </div>
          <div className={`${className}__box`}>
            <label className={`${className}__label`}>Dose</label>
            <input
              placeholder="Please enter the medication dose"
              id="dose"
              name="dose"
              className={
                errors.dose
                  ? `${className}__input ${className}__input-error`
                  : `${className}__input`
              }
              value={dose}
              onChange={(e) => {
                setDose(e.target.value);
                setErrors((prevErrors) => ({ ...prevErrors, dose: "" }));
              }}
            />
            {errors.dose && (
              <div className={`${className}__error`}>{errors.dose}</div>
            )}
          </div>
          <div className={`${className}__box`}>
            <label className={`${className}__label`}>Notes</label>
            <input
              placeholder="Please enter any additional notes (optional)"
              id="notes"
              name="notes"
              className={`${className}__input`}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className={`${className}__box`}>
            <label className={`${className}__label`}>Schedule</label>
            <select
              id="schedule"
              name="schedule"
              className={`${className}__schedule`}
              value={selectedSchedule}
              onChange={handleScheduleChange}
            >
              <option
                className={`${className}__option`}
                hidden
                disabled
                value=""
              >
                Please select
              </option>
              {scheduleOptions.map((option, index) => (
                <option key={index} value={option.label}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.selectedSchedule && (
              <div className={`${className}__error`}>
                {errors.selectedSchedule}
              </div>
            )}
          </div>
          <div className={`${className}__box`}>
            <div className={`${className}__times`}>{renderTimeInputs()}</div>
          </div>
          <div className={`${className}__box`}>
            <label className={`${className}__label`}>Quantity</label>
            <input
              placeholder="Please enter the medication quantity"
              id="quantity"
              name="quantity"
              type="number"
              className={
                errors.quantity
                  ? `${className}__input ${className}__input-error`
                  : `${className}__input`
              }
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                setErrors((prevErrors) => ({ ...prevErrors, quantity: "" }));
              }}
            />
            {errors.quantity && (
              <div className={`${className}__error`}>{errors.quantity}</div>
            )}
          </div>
          <div className={`${className}__buttons`}>
            <button
              type="button"
              className={`${className}__button edit-med__button--delete add-med__button--back`}
              onClick={isEdit ? handleSecondClick : handleSecond}
            >
              {buttonSecond}
            </button>
            <button type="submit" className={`${className}__button`}>
              {buttonName}
            </button>
          </div>
          {showDeleteAlert && (
            <DeleteAlert
              handleDeleteButton={handleDeleteButton}
              handleHide={handleHideDeleteAlert}
            />
          )}
        </form>
      </div>
    </div>
  );
}
