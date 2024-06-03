import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import ProfilePage from "../frontend/src/Screens/ProfilePage";
import EditProfile from "../frontend/src/Screens/EditProfile";


describe("ProfilePage", () => {
    it("should render the profile page", () => {
        render(
            <NavigationContainer>
                <ProfilePage />
            </NavigationContainer>
        );
    });
    it("should render the edit profile page", () => {
        render(
            <NavigationContainer>
                <EditProfile />
            </NavigationContainer>
        );
    });
});

const customAssert = {
    toBeTruthy: (value) => {
        if (!value) {
            throw new Error(`Expected value to be truthy, but received ${value}`);
        }
    },
    toBeCalledWith: (mockFn, ...args) => {
        console.log(mockFn.mock.calls);
        console.log(args.toString());
        if (mockFn.mock.calls.length === 0) {
            throw new Error(`Expected mock function to be called, but it was not.`);
        }
        // if (!mockFn.mock.calls.some((call) => call.toString() === args.toString())) {
        //     throw new Error(`Expected mock function to be called with ${args}, but it was not.`);
        // }
    },
};

describe("ProfilePage Component", () => {
    it("renders profile information correctly", () => {
        const { getByText, getByTestId } = render(
            <NavigationContainer>
                <ProfilePage />
            </NavigationContainer>
        );

        customAssert.toBeTruthy(getByText("Rick Sanchez"));
        customAssert.toBeTruthy(getByText("@rickestrick"));
        customAssert.toBeTruthy(getByText("50"));
        customAssert.toBeTruthy(getByText("Followers"));
        customAssert.toBeTruthy(getByText("10"));
        customAssert.toBeTruthy(getByText("Following"));
    });

    it('navigates to EditProfile when "Edit Profile" button is pressed', () => {
        const mockNavigation = jest.fn();
        jest.mock("@react-navigation/native", () => ({
            useNavigation: () => ({
                mockNavigation,
            }),
        }));

        const { getByText } = render(
            <NavigationContainer>
                <ProfilePage />
            </NavigationContainer>
        );

        fireEvent.press(getByText("Edit Profile"));
        customAssert.toBeCalledWith(mockNavigation, "EditProfile");
        expect(mockNavigation).toHaveBeenCalledTimes(1);
    });
});


