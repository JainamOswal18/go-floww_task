import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Circle, 
  TrendingUp, 
  Calendar,
  Target,
  Activity
} from 'lucide-react';

interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
}

export const StatisticsSection: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    completed: 0,
    pending: 0,
    completionRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats();
      subscribeToTaskChanges();

      const handler = () => fetchStats();
      window.addEventListener('task-stats-should-refresh', handler);

      return () => {
        window.removeEventListener('task-stats-should-refresh', handler);
      };
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('completed')
        .eq('user_id', user?.id);

      if (error) throw error;

      const total = data?.length || 0;
      const completed = data?.filter(task => task.completed).length || 0;
      const pending = total - completed;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

      setStats({
        total,
        completed,
        pending,
        completionRate,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToTaskChanges = () => {
    const channel = supabase
      .channel('stats-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${user?.id}`,
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
    description: string;
    color?: string;
  }> = ({ title, value, icon, description, color = "text-primary" }) => (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <div className={`${color} opacity-75`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Statistics
          </CardTitle>
          <CardDescription>Loading your task statistics...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Statistics
        </CardTitle>
        <CardDescription>
          Track your productivity and task completion progress
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Total Tasks"
            value={stats.total}
            icon={<Target className="h-8 w-8" />}
            description="All tasks created"
            color="text-blue-600"
          />
          
          <StatCard
            title="Completed"
            value={stats.completed}
            icon={<CheckCircle className="h-8 w-8" />}
            description="Tasks finished"
            color="text-green-600"
          />
          
          <StatCard
            title="Pending"
            value={stats.pending}
            icon={<Circle className="h-8 w-8" />}
            description="Tasks remaining"
            color="text-orange-600"
          />
        </div>

        {stats.total > 0 && (
          <Card className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold">Completion Rate</h4>
                </div>
                <Badge variant="secondary" className="text-lg font-bold">
                  {stats.completionRate}%
                </Badge>
              </div>
              
              <Progress 
                value={stats.completionRate} 
                className="h-3 mb-2"
              />
              
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{stats.completed} completed</span>
                <span>{stats.pending} remaining</span>
              </div>
            </CardContent>
          </Card>
        )}

        {stats.total === 0 && (
          <Card className="border-dashed">
            <CardContent className="p-6 text-center">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h4 className="font-semibold mb-2">No Statistics Yet</h4>
              <p className="text-sm text-muted-foreground">
                Add some tasks to see your productivity statistics here!
              </p>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};
