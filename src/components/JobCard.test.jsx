import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import JobCard from "../components/JobCard";

const sampleJob = {
  _id: "job1",
  company: "TCS",
  position: "Frontend Developer",
  status: "Applied",
  notes: "Applied via LinkedIn",
  followUpDate: null,
};

describe("JobCard", () => {
  test("renders company, position, status and notes", () => {
    render(<JobCard job={sampleJob} onUpdateStatus={() => {}} onDelete={() => {}} />);

    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
    expect(screen.getByText("TCS")).toBeInTheDocument();
    expect(screen.getByText("Applied via LinkedIn")).toBeInTheDocument();
    expect(screen.getAllByText("Applied").length).toBeGreaterThan(0);
  });

  test("calls onDelete with the job id when Delete is clicked", () => {
    const onDelete = vi.fn();
    render(<JobCard job={sampleJob} onUpdateStatus={() => {}} onDelete={onDelete} />);

    fireEvent.click(screen.getByText("Delete"));

    expect(onDelete).toHaveBeenCalledWith("job1");
  });

  test("calls onUpdateStatus with new status when select is changed", () => {
    const onUpdateStatus = vi.fn();
    render(<JobCard job={sampleJob} onUpdateStatus={onUpdateStatus} onDelete={() => {}} />);

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "Interview" } });

    expect(onUpdateStatus).toHaveBeenCalledWith("job1", "Interview");
  });
});
