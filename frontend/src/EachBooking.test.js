// EachBooking.test.js
import React from "react";
import { render, fireEvent, screen, act } from "@testing-library/react";
import EachBooking from "./components/EachBooking";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { acceptBooking, declineBooking } from "./components/PostListing";

const mockAcceptBooking = jest.fn();
const mockDeclineBooking = jest.fn();
const mockedNavigate = jest.fn();

// Mocking the external functions and modules
jest.mock("./components/PostListing", () => ({
  acceptBooking: jest.fn(),
  declineBooking: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("EachBooking", () => {
  const mockBooking = {
    id: "123",
    status: "pending",
    dateRange: [
      { startDate: "2023-01-01", endDate: "2023-01-03" },
      { startDate: "2023-02-01", endDate: "2023-02-03" },
    ],
  };

  const renderWithRouter = (ui, { route = "/" } = {}) => {
    window.history.pushState({}, "Test page", route);
    return render(ui, { wrapper: BrowserRouter });
  };

  it("renders booking details correctly", async () => {
    await act(async () => {
      render(<EachBooking booking={mockBooking} />);
    });

    expect(screen.getByText(/status: pending/i)).toBeInTheDocument();
    mockBooking.dateRange.forEach((range, index) => {
      expect(
        screen.getByText(new RegExp(`StartDate: ${range.startDate}`))
      ).toBeInTheDocument();
      expect(
        screen.getByText(new RegExp(`EndDate: ${range.endDate}`))
      ).toBeInTheDocument();
    });
  });

  it("calls acceptBooking and navigate on Accept button click", async () => {
    await act(async () => {
      renderWithRouter(<EachBooking booking={mockBooking} />);
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /accept/i }));
    });

    expect(acceptBooking).toHaveBeenCalledWith(mockBooking.id);
    expect(mockedNavigate).toHaveBeenCalledWith("/showAllListing");
  });

  it("calls declineBooking and navigate on Decline button click", async () => {
    await act(async () => {
      renderWithRouter(<EachBooking booking={mockBooking} />);
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /decline/i }));
    });

    expect(declineBooking).toHaveBeenCalledWith(mockBooking.id);
    expect(mockedNavigate).toHaveBeenCalledWith("/showAllListing");
  });
});
