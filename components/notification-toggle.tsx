// Simple modal component for notification details
"use client";

// Notification interface for notification data
export interface Notification {
  id: number;
  userId: string;
  channel: string;
  type: string;
  title: string;
  message: string;
  priority: string;
  isRead: boolean;
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { Button } from "./ui/button";
import { useLanguage } from "@/contexts/language-context";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "./ui/dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";

const VisuallyHidden = ({ children }: { children: React.ReactNode }) => (
  <span className="sr-only">{children}</span>
);

function NotificationModal({
  open,
  onClose,
  notification,
}: {
  open: boolean;
  onClose: () => void;
  notification: Notification | null;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full p-0">
        {notification && (
          <VisuallyHidden>
            <DialogTitle>{notification.title}</DialogTitle>
          </VisuallyHidden>
        )}
        {notification && (
          <Card className="border-none shadow-none bg-background">
            <CardHeader className="pb-2 flex flex-row items-center gap-3">
              <span
                className={`inline-block h-3 w-3 rounded-full ${
                  notification.isRead
                    ? "bg-gray-300"
                    : "bg-primary animate-pulse"
                }`}
                title={notification.isRead ? "Read" : "Unread"}
              />
              <Badge variant="secondary" className="capitalize">
                {notification.type}
              </Badge>
              <span className="ml-auto text-xs text-muted-foreground">
                {new Date(notification.createdAt).toLocaleString()}
              </span>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="font-bold text-lg mb-2 text-foreground flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                {notification.title}
              </div>
              <div className="mb-4 text-base text-muted-foreground">
                {notification.message}
              </div>
              {notification.data &&
                Object.keys(notification.data).length > 0 && (
                  <div className="text-xs text-muted-foreground bg-accent/40 rounded p-2 mb-2">
                    <span className="font-semibold">Extra Data:</span>
                    <pre className="whitespace-pre-wrap break-all mt-1">
                      {JSON.stringify(notification.data, null, 2)}
                    </pre>
                  </div>
                )}
              <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground">
                <span>
                  Channel:{" "}
                  <span className="font-medium text-foreground">
                    {notification.channel}
                  </span>
                </span>
                <span>
                  Priority:{" "}
                  <Badge variant="outline">{notification.priority}</Badge>
                </span>
              </div>
            </CardContent>
            <CardFooter className="justify-end pt-2">
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            </CardFooter>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function NotificationToggle({ tooltip }: { tooltip?: string }) {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pagination, setPagination] = useState<any>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/api/v1/notifications",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch notifications");
      const data = await res.json();
      setNotifications(data.notifications || []);
      setPagination({
        page: data.page || 1,
        limit: data.limit || 10,
        total: data.total || 0,
        totalPages: data.totalPages || 1,
        hasNext: data.hasNext || false,
        hasPrev: data.hasPrev || false,
      });
      setLoading(false);
    } catch (error) {
      setNotifications([]);
      setLoading(false);
      // Optionally handle error (e.g., show toast)
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [modalOpen]);

  const toggleNotification = async (notification: Notification) => {
    setModalOpen(true);
    setSelectedNotification(notification);
    // Mark as read
    await fetch(
      process.env.NEXT_PUBLIC_API_URL +
        "/api/v1/notifications/" +
        notification.id,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );
    // Optionally, refresh notifications list after marking as read
    fetchNotifications();
  };

  const button = (
    <Button variant="outline" size="icon" className="rounded-full relative">
      <Bell className="h-5 w-5" />
      {/* Dot indicator if there are unread notifications */}
      {notifications.some((n) => !n.isRead) && (
        <span className="absolute top-1 right-1 flex h-2 w-2">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex h-2 w-2 rounded-full bg-primary"
          />
        </span>
      )}
      <span className="sr-only">{t("nav.notifivation_tooltip")}</span>
    </Button>
  );

  const dropdown = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{button}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="py-2 px-3 text-base font-semibold flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          {t("nav.notifivation_tooltip")}
        </div>
        <div className="divide-y">
          {loading ? (
            <div className="p-4 space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-md" />
              ))}
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start gap-1 px-4 py-3 cursor-pointer ${
                  !notification.isRead ? "bg-accent/30" : ""
                }`}
                onClick={() => toggleNotification(notification)}
              >
                <div className="flex items-center w-full gap-2">
                  {/* Dot indicator for unread */}
                  {!notification.isRead && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="inline-flex h-1.5 w-1.5 rounded-full bg-primary"
                    />
                  )}
                  <span className="font-semibold text-sm truncate flex-1">
                    {notification.title}
                  </span>
                  <Badge variant="secondary" className="capitalize">
                    {notification.type}
                  </Badge>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {new Date(notification.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground line-clamp-2">
                  {notification.message}
                </span>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground text-sm">
              {t("common.no_notifications")}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{dropdown}</TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <>
      {dropdown}
      <NotificationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        notification={selectedNotification}
      />
    </>
  );
}
