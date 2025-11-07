"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  User,
  CreditCard,
  Shield,
  Link as LinkIcon,
  Palette,
  Download,
  Trash2,
  CheckCircle,
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="ml-64 flex-1">
        <div className="grid-background min-h-screen p-8">
          <div className="mx-auto max-w-4xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground">
                Manage your account and preferences
              </p>
            </div>

            <div className="space-y-6">
              {/* Profile Section */}
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                      JD
                    </div>
                    <Button variant="outline" size="sm">
                      Change Avatar
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input defaultValue="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label>Username</Label>
                      <Input defaultValue="johndoe" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="flex gap-2">
                      <Input defaultValue="john@example.com" readOnly />
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Verified
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Bio</Label>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="Tell us about yourself..."
                      defaultValue="Powerlifter focusing on strength gains"
                    />
                  </div>

                  <Button>Save Changes</Button>
                </CardContent>
              </Card>

              {/* Training Preferences */}
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Training Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Default Training Days</Label>
                    <div className="flex gap-2">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                        (day) => (
                          <Button
                            key={day}
                            variant={
                              ["Mon", "Tue", "Thu", "Fri"].includes(day)
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                          >
                            {day}
                          </Button>
                        )
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Preferred Units</Label>
                      <div className="flex gap-2">
                        <Button variant="default" size="sm" className="flex-1">
                          lbs
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          kg
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Default Gym</Label>
                      <Input defaultValue="24 Hour Fitness" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="font-semibold">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive workout reminders and progress updates
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Enabled
                    </Button>
                  </div>

                  <Button>Save Preferences</Button>
                </CardContent>
              </Card>

              {/* Subscription */}
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Subscription
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border-2 border-primary p-6 glow-green">
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold">Pro Plan</h3>
                        <p className="text-sm text-muted-foreground">
                          Full access to all features
                        </p>
                      </div>
                      <Badge className="bg-primary">Active</Badge>
                    </div>
                    <ul className="mb-4 space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        AI Program Generation
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        Gains Debugger
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        Coach Chat (Unlimited)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        Advanced Analytics
                      </li>
                    </ul>
                    <p className="text-sm text-muted-foreground">
                      Renews on Dec 7, 2024 • $9.99/month
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <div className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5" />
                        <div>
                          <p className="font-semibold">•••• •••• •••• 4242</p>
                          <p className="text-sm text-muted-foreground">
                            Expires 12/25
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Update
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Billing History</Label>
                    <div className="rounded-lg border border-border overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-muted">
                          <tr>
                            <th className="p-3 text-left font-semibold">Date</th>
                            <th className="p-3 text-left font-semibold">
                              Description
                            </th>
                            <th className="p-3 text-left font-semibold">
                              Amount
                            </th>
                            <th className="p-3 text-left font-semibold">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          <tr>
                            <td className="p-3">Nov 7, 2024</td>
                            <td className="p-3">Pro Plan - Monthly</td>
                            <td className="p-3 terminal-text">$9.99</td>
                            <td className="p-3">
                              <Badge variant="secondary" className="text-xs">
                                Paid
                              </Badge>
                            </td>
                          </tr>
                          <tr>
                            <td className="p-3">Oct 7, 2024</td>
                            <td className="p-3">Pro Plan - Monthly</td>
                            <td className="p-3 terminal-text">$9.99</td>
                            <td className="p-3">
                              <Badge variant="secondary" className="text-xs">
                                Paid
                              </Badge>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <Button variant="outline">Manage Subscription</Button>
                </CardContent>
              </Card>

              {/* Integrations */}
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LinkIcon className="h-5 w-5" />
                    Integrations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: "Strava", connected: true },
                    { name: "MyFitnessPal", connected: false },
                    { name: "Fitbit", connected: false },
                  ].map((integration) => (
                    <div
                      key={integration.name}
                      className="flex items-center justify-between rounded-lg border border-border p-4"
                    >
                      <div>
                        <p className="font-semibold">{integration.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {integration.connected
                            ? "Connected"
                            : "Not connected"}
                        </p>
                      </div>
                      <Button
                        variant={integration.connected ? "outline" : "default"}
                        size="sm"
                      >
                        {integration.connected ? "Disconnect" : "Connect"}
                      </Button>
                    </div>
                  ))}

                  <div className="rounded-lg border border-primary/50 p-4">
                    <p className="mb-2 font-semibold">API Access</p>
                    <p className="mb-3 text-sm text-muted-foreground">
                      Generate an API key to access your data programmatically
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Generate API Key
                      </Button>
                      <Button variant="ghost" size="sm">
                        View Documentation
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data & Privacy */}
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Data & Privacy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="font-semibold">Download Your Data</p>
                      <p className="text-sm text-muted-foreground">
                        Export all your workout data
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="font-semibold">Privacy Settings</p>
                      <p className="text-sm text-muted-foreground">
                        Control who can see your profile
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>

                  <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
                    <div className="mb-3 flex items-start gap-3">
                      <Trash2 className="h-5 w-5 text-destructive" />
                      <div>
                        <p className="font-semibold text-destructive">
                          Delete Account
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Permanently delete your account and all data. This
                          action cannot be undone.
                        </p>
                      </div>
                    </div>
                    <Button variant="destructive" size="sm">
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Appearance */}
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Appearance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <div className="grid grid-cols-3 gap-3">
                      <Button variant="default" size="sm">
                        Dark
                      </Button>
                      <Button variant="outline" size="sm">
                        Darker
                      </Button>
                      <Button variant="outline" size="sm">
                        Terminal
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Accent Color</Label>
                    <div className="flex gap-2">
                      <div className="h-10 w-10 rounded-full bg-primary border-2 border-primary cursor-pointer" />
                      <div className="h-10 w-10 rounded-full bg-blue-500 border-2 border-transparent hover:border-border cursor-pointer" />
                      <div className="h-10 w-10 rounded-full bg-purple-500 border-2 border-transparent hover:border-border cursor-pointer" />
                      <div className="h-10 w-10 rounded-full bg-orange-500 border-2 border-transparent hover:border-border cursor-pointer" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Font Size</Label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="12"
                        max="18"
                        defaultValue="14"
                        className="flex-1"
                      />
                      <span className="text-sm text-muted-foreground w-12">
                        14px
                      </span>
                    </div>
                  </div>

                  <Button>Apply Changes</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
