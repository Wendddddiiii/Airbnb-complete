import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SignInForm from "./components/SignInForm";

// Mock navigate function from useNavigate
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

// Mock global alert function
global.alert = jest.fn();

describe("SignInForm", () => {
  beforeEach(() => {
    render(<SignInForm setToken={() => {}} />);
  });

  it("renders correctly", () => {
    expect(screen.getByText(/email:/i)).toBeInTheDocument();
    expect(screen.getByText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("shows an alert when email or password is missing", async () => {
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() =>
      expect(global.alert).toHaveBeenCalledWith(
        "Please enter both email and password."
      )
    );
  });

  it("submits the form with email and password", async () => {
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() =>
      expect(global.alert).not.toHaveBeenCalledWith(
        "Please enter both email and password."
      )
    );
  });
});
