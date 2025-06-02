"use client";
import React, { useEffect } from "react";
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
} from "lucide-react";
import {
  clearError,
  fetchUserProfile,
  updateUserProfile,
} from "@/redux/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

// Zod validation schema
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

type UserProfileFormData = z.infer<typeof userProfileSchema>;

const UserProfileForm = () => {
  const dispatch = useAppDispatch();
  const { currentUser, isLoading, updateLoading, error } = useAppSelector(
    (state) => state.user,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    watch,
  } = useForm<UserProfileFormData>({
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

  // Load user profile on component mount
  useEffect(() => {
    if (!currentUser) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, currentUser]);

  // Update form when user data changes
  useEffect(() => {
    if (currentUser) {
      reset({
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
  }, [currentUser, reset]);

  // Clear error when component unmounts or user starts typing
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onSubmit = async (data: UserProfileFormData) => {
    dispatch(updateUserProfile(data));
  };

  const handleRefresh = () => {
    dispatch(fetchUserProfile());
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                    {...register("name")}
                    placeholder="Enter your full name"
                    className="mt-1"
                    disabled={updateLoading}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Display email (read-only) */}
                {currentUser?.email && (
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={currentUser.email}
                      className="mt-1 bg-gray-50"
                      disabled
                      readOnly
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Email cannot be changed
                    </p>
                  </div>
                )}
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
                    {...register("details.phone")}
                    placeholder="0333 1234567"
                    className={`mt-1 ${errors.details?.phone ? "border-red-500" : ""}`}
                    disabled={updateLoading}
                  />
                  {errors.details?.phone && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.details.phone.message}
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
                    {...register("details.address")}
                    placeholder="123 Main Street, Apt 4B"
                    className={`mt-1 ${errors.details?.address ? "border-red-500" : ""}`}
                    disabled={updateLoading}
                  />
                  {errors.details?.address && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.details.address.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      type="text"
                      {...register("details.city")}
                      placeholder="Faisalabad"
                      className={`mt-1 ${errors.details?.city ? "border-red-500" : ""}`}
                      disabled={updateLoading}
                    />
                    {errors.details?.city && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.details.city.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="state">State/Province *</Label>
                    <Input
                      id="state"
                      type="text"
                      {...register("details.state")}
                      placeholder="Punjab"
                      className={`mt-1 ${errors.details?.state ? "border-red-500" : ""}`}
                      disabled={updateLoading}
                    />
                    {errors.details?.state && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.details.state.message}
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
                      {...register("details.country")}
                      placeholder="Pakistan"
                      className={`mt-1 ${errors.details?.country ? "border-red-500" : ""}`}
                      disabled={updateLoading}
                    />
                    {errors.details?.country && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.details.country.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="postalCode">Postal Code *</Label>
                    <Input
                      id="postalCode"
                      type="text"
                      {...register("details.postalCode")}
                      placeholder="10001"
                      className={`mt-1 ${errors.details?.postalCode ? "border-red-500" : ""}`}
                      disabled={updateLoading}
                    />
                    {errors.details?.postalCode && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.details.postalCode.message}
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
                disabled={updateLoading || !isDirty}
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
    </div>
  );
};

export default UserProfileForm;
