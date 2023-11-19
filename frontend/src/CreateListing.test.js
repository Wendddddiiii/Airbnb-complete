import React from "react";
import "@testing-library/jest-dom";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import CreateListing from "./components/CreateListing";
import { act } from "@testing-library/react";
// Mock navigate function from useNavigate
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

// Mock fileToDataUrl function
const fileToDataUrl = jest.fn();

describe("CreateListing", () => {
  beforeEach(async () => {
    // Use `act` to wrap the render function for handling async operations
    await act(async () => {
      render(<CreateListing />);
    });
  });

  it("renders the form", () => {
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/property type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/number of bathrooms/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/number of bedrooms/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/number of beds/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/property amenities/i)).toBeInTheDocument();
  });

  it("validates form fields", async () => {
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    });
    // Wait for the error message to appear
    await waitFor(() => {
      expect(
        screen.getByText(/please fill out all required fields/i)
      ).toBeInTheDocument();
    });
  });

  it("submits the form with valid data", async () => {
    // Fill in all the text inputs
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/title/i), {
        target: { value: "New Listing" },
      });
      fireEvent.change(screen.getByLabelText(/address/i), {
        target: { value: "123 Main St" },
      });
      fireEvent.change(screen.getByLabelText(/price/i), {
        target: { value: "100" },
      });
      fireEvent.change(screen.getByLabelText(/property type/i), {
        target: { value: "Apartment" },
      });
      fireEvent.change(screen.getByLabelText(/number of bathrooms/i), {
        target: { value: "1" },
      });
      fireEvent.change(screen.getByLabelText(/number of bedrooms/i), {
        target: { value: "2" },
      });
      fireEvent.change(screen.getByLabelText(/number of beds/i), {
        target: { value: "3" },
      });
      fireEvent.change(screen.getByLabelText(/property amenities/i), {
        target: { value: "Wifi, Pool" },
      });

      // Mock file upload
      fileToDataUrl.mockResolvedValue("mock-thumbnail-url");
      const fileInput = screen.getByLabelText(/thumbnail/i);
      const file = new File(["thumbnail"], "thumbnail.png", {
        type: "image/png",
      });
      fireEvent.change(fileInput, { target: { files: [file] } });
    });
  });
});
