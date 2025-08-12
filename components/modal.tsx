"use client";

import { X, CheckCircle, AlertCircle, AlertTriangle, Wrench } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

import clsx from "clsx";

type StatusModalProps = {
  isOpen: boolean;
  type: "success" | "error" | "warning" | "maintenance";
  title: string;
  message: string;
  onClose: () => void;
};

export function StatusModal({ isOpen, type, title, message, onClose }: StatusModalProps) {
  if (!isOpen) return null;

  const iconMap = {
    success: <CheckCircle className="h-10 w-10 text-green-400" />,
    error: <AlertCircle className="h-10 w-10 text-red-400" />,
    warning: <AlertTriangle className="h-10 w-10 text-yellow-400" />,
    maintenance: <Wrench className="h-10 w-10 text-blue-400" />,
  };

  const borderMap = {
    success: "border-green-500/30",
    error: "border-red-500/30",
    warning: "border-yellow-500/30",
    maintenance: "border-blue-500/30",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card
        className={clsx(
          "bg-gradient-to-br from-gray-900/90 to-black/90 max-w-md w-full mx-4",
          borderMap[type]
        )}
      >
        <CardHeader className="flex flex-col items-center text-center">
          {iconMap[type]}
          <CardTitle className="mt-3 text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-gray-300">
          <p>{message}</p>
          <div className="mt-6 flex justify-center">
            <Button
              onClick={onClose}
              className={clsx(
                "px-6",
                type === "success" && "bg-green-500 hover:bg-green-600",
                type === "error" && "bg-red-500 hover:bg-red-600",
                type === "warning" && "bg-yellow-500 hover:bg-yellow-600 text-black",
                type === "maintenance" && "bg-blue-500 hover:bg-blue-600"
              )}
            >
              OK
            </Button>
          </div>
        </CardContent>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </Card>
    </div>
  );
}
