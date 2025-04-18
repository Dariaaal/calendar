import React, { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Modal from "react-modal";
import {
  EventClickArg,
  EventContentArg,
  DateSelectArg,
  EventDropArg,
} from "@fullcalendar/core";
import css from "./Calendar.module.css";
import { cx } from "../../lib/classNames";
import CloseIcon from "../../icons/CloseIcon";

Modal.setAppElement("#root");

type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end?: string;
  color: string;
};

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Partial<CalendarEvent>>({});
  const [isEditMode, setIsEditMode] = useState(false);
  const calendarRef = useRef<any>(null);
  const [currentTitle, setCurrentTitle] = useState(
    calendarRef.current?.getApi().view.title
  );
  const [activeView, setActiveView] = useState<string>("dayGridMonth");
  const [modalPosition, setModalPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  const handleViewChange = (view: string) => {
    setActiveView(view);
    calendarRef.current?.getApi().changeView(view);
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setIsEditMode(false);
    setCurrentEvent({
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      color: "var(--color-accent)",
    });

    const target = selectInfo.jsEvent?.target as HTMLElement;
    if (target) {
      const rect = target.getBoundingClientRect();
      const modalWidth = 201;
      const offsetY = 20;

      const centerX = rect.left + rect.width / 2;
      const bottomY = rect.bottom;

      setModalPosition({
        top: bottomY - offsetY + window.scrollY,
        left: centerX - modalWidth / 2 + window.scrollX,
      });
    }

    setModalIsOpen(true);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    setIsEditMode(true);
    setCurrentEvent({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.startStr,
      end: clickInfo.event.endStr,
      color: clickInfo.event.backgroundColor,
    });

    const target = clickInfo.jsEvent?.target as HTMLElement;
    if (target) {
      const rect = target.getBoundingClientRect();
      const modalWidth = 300;
      const offsetY = 20;

      const centerX = rect.left + rect.width / 2;
      const bottomY = rect.bottom;

      setModalPosition({
        top: bottomY - offsetY + window.scrollY,
        left: centerX - modalWidth / 2 + window.scrollX,
      });
    }

    setModalIsOpen(true);
  };

  const handleEventDrop = (dropInfo: EventDropArg) => {
    const updatedEvents = events.map((event) =>
      event.id === dropInfo.event.id
        ? {
            ...event,
            start: dropInfo.event.start?.toISOString() || "",
            end: dropInfo.event.end?.toISOString(),
          }
        : event
    );
    setEvents(updatedEvents);
  };

  const handleSave = () => {
    if (!currentEvent.title || !currentEvent.start || !currentEvent.end) {
      setModalError("All fields are required.");
      return;
    }

    if (currentEvent.title.length > 30) {
      setModalError("Event title must be 30 characters or less.");
      return;
    }

    setModalError(null);

    if (isEditMode && currentEvent.id) {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === currentEvent.id
            ? ({ ...e, ...currentEvent } as CalendarEvent)
            : e
        )
      );
    } else {
      setEvents((prev) => [
        ...prev,
        {
          ...(currentEvent as CalendarEvent),
          id: String(new Date().getTime()),
        },
      ]);
    }

    setModalIsOpen(false);
    setCurrentEvent({});
  };

  const handleDelete = () => {
    if (!currentEvent.id) return;
    setEvents((prev) => prev.filter((e) => e.id !== currentEvent.id));
    setModalIsOpen(false);
    setCurrentEvent({});
  };

  const renderEventContent = (eventInfo: EventContentArg) => (
    <div
      style={{
        backgroundColor: eventInfo.event.backgroundColor,
        fontSize: "13px",
        color: "var(--color-text-white)",
        padding:
          (activeView === "dayGridMonth" && "7px 14px") ||
          (activeView === "timeGridWeek" && "3px 14px") ||
          "7px 14px",
        borderRadius: "4px",
        width: "100%",
      }}
    >
      <span>{eventInfo.event.title}</span>
    </div>
  );

  const getDate = (iso?: string) => {
    if (!iso) return "";
    const date = new Date(iso);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getTime = (iso?: string) => {
    if (!iso) return "";
    const date = new Date(iso);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleDateChange = (date: string) => {
    const time = getTime(currentEvent.start);
    setCurrentEvent({
      ...currentEvent,
      start: new Date(`${date}T${time || "00:00"}`).toISOString(),
    });
  };

  const handleTimeChange = (time: string, isEnd: boolean = false) => {
    const date = getDate(currentEvent.start);
    const newTime = new Date(
      `${date || new Date().toISOString().slice(0, 10)}T${time}`
    ).toISOString();

    if (isEnd) {
      setCurrentEvent({
        ...currentEvent,
        end: newTime,
      });
    } else {
      setCurrentEvent({
        ...currentEvent,
        start: newTime,
      });
    }
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    setModalError(null);
  };

  return (
    <div className={css["calendar-wrapper"]}>
      <div
        className={cx(
          "fx",
          "fx--justify-sb",
          "fx--ai-center",
          css["calendar-header"]
        )}
      >
        <p className={css["calendar-text"]}>Calendar view</p>
        <div className={css["calendar-controls"]}>
          <button
            onClick={() => handleViewChange("dayGridMonth")}
            className={activeView === "dayGridMonth" ? css["active"] : ""}
          >
            Month
          </button>
          <button
            onClick={() => handleViewChange("timeGridWeek")}
            className={activeView === "timeGridWeek" ? css["active"] : ""}
          >
            Week
          </button>
          <button
            onClick={() => handleViewChange("timeGridDay")}
            className={activeView === "timeGridDay" ? css["active"] : ""}
          >
            Day
          </button>
          <button>Agenda</button>
        </div>
      </div>

      <div
        className={cx(
          "fx",
          "fx--justify-sb",
          "fx--ai-center",
          css["calendar-title-container"]
        )}
      >
        <div className={css["calendar-controls"]}>
          <button onClick={() => calendarRef.current?.getApi().today()}>
            Today
          </button>
          <button onClick={() => calendarRef.current?.getApi().prev()}>
            Back
          </button>
          <button onClick={() => calendarRef.current?.getApi().next()}>
            Next
          </button>
        </div>
        <div className={css["calendar-text"]}>{currentTitle}</div>
        <div style={{ width: 185 }} />
      </div>

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        events={events}
        select={handleDateSelect}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        eventContent={renderEventContent}
        slotLabelFormat={{
          hour: "numeric",
          minute: "2-digit",
          meridiem: "short",
          hour12: true,
        }}
        height="auto"
        headerToolbar={false}
        datesSet={(arg) => {
          setCurrentTitle(arg.view.title);
          if (arg.view.type === "dayGridMonth") {
            document.querySelectorAll(".fc-daygrid-day-frame").forEach((el) => {
              el.classList.add(css["month-cell"]);
            });
          }
        }}
        timeZone="local"
        dayCellDidMount={(arg) => {
          if (calendarRef.current?.getApi().view.type === "dayGridMonth") {
            arg.el.classList.add(css["month-cell"]);
          }
        }}
      />

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        className={css["modal"]}
        overlayClassName={css["overlay"]}
        style={{
          content: {
            top: modalPosition?.top ?? "50%",
            left: modalPosition?.left ?? "50%",
            right: "auto",
            bottom: "auto",
            transform: "none",
            position: "absolute",
          },
        }}
      >
        <button
          className={css["button-close"]}
          onClick={handleCloseModal}
        >
          <CloseIcon />
        </button>
        <label className={css["calendar-input-label"]}>event name</label>
        <input
          className={css["input"]}
          type="text"
          value={currentEvent.title || ""}
          maxLength={30}
          onChange={(e) =>
            setCurrentEvent({ ...currentEvent, title: e.target.value })
          }
        />

        <label className={css["calendar-input-label"]}>event date</label>
        <input
          className={css["input"]}
          type="date"
          value={getDate(currentEvent.start)}
          onChange={(e) => handleDateChange(e.target.value)}
        />

        <label className={css["calendar-input-label"]}>event start time</label>
        <input
          className={css["input"]}
          type="time"
          value={getTime(currentEvent.start)}
          onChange={(e) => handleTimeChange(e.target.value)}
        />

        <label className={css["calendar-input-label"]}>event end time</label>
        <input
          className={css["input"]}
          type="time"
          value={getTime(currentEvent.end || currentEvent.start)}
          onChange={(e) => handleTimeChange(e.target.value, true)}
        />

        <label className={css["calendar-input-label"]}>color</label>
        <input
          className={css["input"]}
          type="color"
          value={currentEvent.color || "var(--color-accent)"}
          onChange={(e) =>
            setCurrentEvent({ ...currentEvent, color: e.target.value })
          }
        />
        {modalError !== null && (
          <p className={css["calendar-error"]}>{modalError}</p>
        )}

        <div className={cx("fx", "fx--justify-sb", css["modal-actions"])}>
          {isEditMode ? (
            <button
              className={cx(css["button"], css["button-left"])}
              onClick={handleDelete}
            >
              Discard
            </button>
          ) : (
            <button
              className={cx(css["button"], css["button-left"])}
              onClick={handleCloseModal}
            >
              Cancel
            </button>
          )}
          <button
            className={cx(css["button"], css["button-right"])}
            onClick={handleSave}
          >
            {isEditMode ? "Edit" : "Save"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Calendar;
