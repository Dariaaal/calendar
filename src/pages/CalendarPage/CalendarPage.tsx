import css from "./CalendarPage.module.css"
import Calendar from "../../components/Calendar/Calendar";

const CalendarPage = () => {
  return (
    <div>
      <h1 className={css["calendar-heading"]}>Calendar</h1>
      <Calendar />
    </div>
  );
};

export default CalendarPage;
