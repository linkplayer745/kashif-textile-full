"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Save,
  User,
  MapPin,
  Phone,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
  Lock,
  CheckCircle,
} from "lucide-react";
import {
  changePassword,
  clearError,
  fetchUserProfile,
  updateUserProfile,
} from "@/redux/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

// Zod validation schema for profile
const userProfileSchema = z.object({
  name: z.string().optional(),
  details: z.object({
    phone: z.string().min(6, "Phone number is required"),
    address: z
      .string()
      .min(5, "Address must be at least 5 characters")
      .max(200, "Address must be less than 200 characters"),
    city: z
      .string()
      .min(2, "City must be at least 2 characters")
      .max(50, "City must be less than 50 characters"),
    state: z
      .string()
      .min(2, "State must be at least 2 characters")
      .max(50, "State must be less than 50 characters"),
    country: z
      .string()
      .min(2, "Country must be at least 2 characters")
      .max(50, "Country must be less than 50 characters"),
    postalCode: z
      .string()
      .min(3, "Postal code must be at least 3 characters")
      .max(10, "Postal code must be less than 10 characters"),
  }),
});

// Zod validation schema for password change
const passwordChangeSchema = z
  .object({
    password: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type UserProfileFormData = z.infer<typeof userProfileSchema>;
type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

const UserProfileForm = () => {
  const dispatch = useAppDispatch();
  const { currentUser, isLoading, updateLoading, error } = useAppSelector(
    (state) => state.user,
  );

  // Local state for password change
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

  // State for password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile form
  const profileForm = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      name: "",
      details: {
        phone: "",
        address: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
      },
    },
  });

  // Password change form
  const passwordForm = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      password: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Load user profile on component mount
  useEffect(() => {
    if (!currentUser) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, currentUser]);

  // Update profile form when user data changes
  useEffect(() => {
    if (currentUser) {
      profileForm.reset({
        name: currentUser.name || "",
        details: currentUser.details || {
          phone: "",
          address: "",
          city: "",
          state: "",
          country: "",
          postalCode: "",
        },
      });
    }
  }, [currentUser, profileForm]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
      setPasswordError(null);
    };
  }, [dispatch]);

  // Clear password success message after 3 seconds
  useEffect(() => {
    if (passwordChangeSuccess) {
      const timer = setTimeout(() => {
        setPasswordChangeSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [passwordChangeSuccess]);

  const onProfileSubmit = async (data: UserProfileFormData) => {
    dispatch(updateUserProfile(data));
  };

  const onPasswordSubmit = async (data: PasswordChangeFormData) => {
    const { password, newPassword } = data;

    setPasswordChangeLoading(true);
    setPasswordError(null);
    setPasswordChangeSuccess(false);

    await dispatch(changePassword({ password, newPassword }))
      .unwrap()
      .then(() => {
        setPasswordChangeSuccess(true);
        passwordForm.reset();
      })
      .catch((error: any) => {
        setPasswordError(error || "Failed to change password");
      })
      .finally(() => {
        setPasswordChangeLoading(false);
      });
  };

  const handleRefresh = () => {
    dispatch(fetchUserProfile());
  };

  // Clear password error when user starts typing
  const clearPasswordError = () => {
    if (passwordError) {
      setPasswordError(null);
    }
    if (passwordChangeSuccess) {
      setPasswordChangeSuccess(false);
    }
  };

  // Show loading spinner while fetching initial data
  if (isLoading && !currentUser) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading profile...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      {/* Profile Information Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Update Profile
              </CardTitle>
              <CardDescription>
                Update your personal information and contact details
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={profileForm.handleSubmit(onProfileSubmit)}
            className="space-y-6"
          >
            {/* Error Alert */}
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    {...profileForm.register("name")}
                    placeholder="Enter your full name"
                    className="mt-1"
                    disabled={updateLoading}
                  />
                  {profileForm.formState.errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {profileForm.formState.errors.name.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900">
                <Phone className="h-4 w-4" />
                Contact Information
              </h3>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...profileForm.register("details.phone")}
                    placeholder="0333XXXXXXX"
                    className={`mt-1 ${profileForm.formState.errors.details?.phone ? "border-red-500" : ""}`}
                    disabled={updateLoading}
                  />
                  {profileForm.formState.errors.details?.phone && (
                    <p className="mt-1 text-sm text-red-600">
                      {profileForm.formState.errors.details.phone.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900">
                <MapPin className="h-4 w-4" />
                Address Information
              </h3>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    type="text"
                    {...profileForm.register("details.address")}
                    placeholder="123 Main Street, Apt 4B"
                    className={`mt-1 ${profileForm.formState.errors.details?.address ? "border-red-500" : ""}`}
                    disabled={updateLoading}
                  />
                  {profileForm.formState.errors.details?.address && (
                    <p className="mt-1 text-sm text-red-600">
                      {profileForm.formState.errors.details.address.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      type="text"
                      {...profileForm.register("details.city")}
                      placeholder="Faisalabad"
                      className={`mt-1 ${profileForm.formState.errors.details?.city ? "border-red-500" : ""}`}
                      disabled={updateLoading}
                    />
                    {profileForm.formState.errors.details?.city && (
                      <p className="mt-1 text-sm text-red-600">
                        {profileForm.formState.errors.details.city.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="state">State/Province *</Label>
                    <Input
                      id="state"
                      type="text"
                      {...profileForm.register("details.state")}
                      placeholder="Punjab"
                      className={`mt-1 ${profileForm.formState.errors.details?.state ? "border-red-500" : ""}`}
                      disabled={updateLoading}
                    />
                    {profileForm.formState.errors.details?.state && (
                      <p className="mt-1 text-sm text-red-600">
                        {profileForm.formState.errors.details.state.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      type="text"
                      {...profileForm.register("details.country")}
                      placeholder="Pakistan"
                      className={`mt-1 ${profileForm.formState.errors.details?.country ? "border-red-500" : ""}`}
                      disabled={updateLoading}
                    />
                    {profileForm.formState.errors.details?.country && (
                      <p className="mt-1 text-sm text-red-600">
                        {profileForm.formState.errors.details.country.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="postalCode">Postal Code *</Label>
                    <Input
                      id="postalCode"
                      type="text"
                      {...profileForm.register("details.postalCode")}
                      placeholder="10001"
                      className={`mt-1 ${profileForm.formState.errors.details?.postalCode ? "border-red-500" : ""}`}
                      disabled={updateLoading}
                    />
                    {profileForm.formState.errors.details?.postalCode && (
                      <p className="mt-1 text-sm text-red-600">
                        {
                          profileForm.formState.errors.details.postalCode
                            .message
                        }
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end border-t border-gray-200 pt-6">
              <Button
                type="submit"
                disabled={updateLoading || !profileForm.formState.isDirty}
                className="w-full sm:w-auto"
              >
                {updateLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Password Change Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Change Password
          </CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            className="space-y-6"
          >
            {/* Success Alert */}
            {passwordChangeSuccess && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Password changed successfully!
                </AlertDescription>
              </Alert>
            )}

            {/* Error Alert */}
            {passwordError && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-800">
                  {passwordError}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <Label htmlFor="currentPassword">Current Password *</Label>
                <div className="relative mt-1">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    {...passwordForm.register("password")}
                    placeholder="Enter your current password"
                    className={`pr-10 ${passwordForm.formState.errors.password ? "border-red-500" : ""}`}
                    disabled={passwordChangeLoading}
                    onChange={(e) => {
                      passwordForm.register("password").onChange(e);
                      clearPasswordError();
                    }}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {passwordForm.formState.errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {passwordForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div>
                <Label htmlFor="newPassword">New Password *</Label>
                <div className="relative mt-1">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    {...passwordForm.register("newPassword")}
                    placeholder="Enter your new password"
                    className={`pr-10 ${passwordForm.formState.errors.newPassword ? "border-red-500" : ""}`}
                    disabled={passwordChangeLoading}
                    onChange={(e) => {
                      passwordForm.register("newPassword").onChange(e);
                      clearPasswordError();
                    }}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {passwordForm.formState.errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {passwordForm.formState.errors.newPassword.message}
                  </p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Password must be at least 8 characters with uppercase,
                  lowercase, and number
                </p>
              </div>

              {/* Confirm New Password */}
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password *</Label>
                <div className="relative mt-1">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    {...passwordForm.register("confirmPassword")}
                    placeholder="Confirm your new password"
                    className={`pr-10 ${passwordForm.formState.errors.confirmPassword ? "border-red-500" : ""}`}
                    disabled={passwordChangeLoading}
                    onChange={(e) => {
                      passwordForm.register("confirmPassword").onChange(e);
                      clearPasswordError();
                    }}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end border-t border-gray-200 pt-6">
              <Button
                type="submit"
                disabled={
                  passwordChangeLoading || !passwordForm.formState.isDirty
                }
                className="w-full sm:w-auto"
              >
                {passwordChangeLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Change Password
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfileForm;
