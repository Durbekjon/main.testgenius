import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Pencil, Plus } from "lucide-react"
import { useEffect, useState } from "react"

interface ActivityDescription {
  en: string
  ru: string
  uz: string
}

interface ActivityMetadata {
  title: {
    en: string
    ru: string
    uz: string
  }
  subject: {
    en: string
    ru: string
    uz: string
  }
  gradeLevel: string
  sectionCount?: number
  participantCount?: number
  durationInMinutes?: number
}

interface Activity {
  id: string
  entityType: string
  actionType: string
  entityId: string
  description: ActivityDescription
  actorId: string
  actor:any
  targetId: string | null
  metadata: ActivityMetadata
  createdAt: string
  updatedAt: string
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/v1/activities/recent?limit=10', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        })
        if (!response.ok) {
          throw new Error('Failed to fetch activities')
        }
        const data = await response.json()
        setActivities(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  if (loading) {
    return <div>Loading activities...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="space-y-8">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src={activity.actor.logo} alt={activity.actor.firstName} />
            <AvatarFallback>{activity.actor.firstName.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="font-medium">{activity.actor.firstName}</span>{" "}
              {activity.description.uz} {" "}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                {activity.actionType === "CREATE" ? (
                  <Plus className="h-3 w-3 text-primary" />
                ) : (
                  <Pencil className="h-3 w-3 text-primary" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date(activity.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
