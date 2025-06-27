import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  CheckCircle, 
  Circle,
  ListTodo
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const TasksSection: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editTask, setEditTask] = useState({ title: '', description: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchTasks();
      subscribeToTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      console.log('Fetching tasks for user:', user?.id);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        throw error;
      }
      
      console.log('Fetched tasks:', data);
      setTasks(data || []);
    } catch (error: any) {
      console.error('Error in fetchTasks:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToTasks = () => {
    const channel = supabase
      .channel('tasks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${user?.id}`,
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          if (payload.eventType === 'INSERT') {
            setTasks(prev => [payload.new as Task, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setTasks(prev => prev.map(task => 
              task.id === payload.new.id ? payload.new as Task : task
            ));
          } else if (payload.eventType === 'DELETE') {
            setTasks(prev => prev.filter(task => task.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const addTask = async () => {
    if (!newTask.title.trim() || submitting) return;

    setSubmitting(true);
    try {
      console.log('Adding new task:', newTask);
      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            title: newTask.title,
            description: newTask.description || null,
            user_id: user?.id,
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error adding task:', error);
        throw error;
      }

      console.log('Task added successfully:', data);

      setTasks(prev => [data, ...prev]);
      
      setNewTask({ title: '', description: '' });
      setAdding(false);
      toast({
        title: "Task added",
        description: "Your task has been added successfully.",
      });
      // Notify stats to refresh
      window.dispatchEvent(new Event('task-stats-should-refresh'));
    } catch (error: any) {
      console.error('Error in addTask:', error);
      setError(error.message);
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const updateTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          title: editTask.title,
          description: editTask.description || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', taskId);

      if (error) throw error;

      setEditing(null);
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      });
      // Notify stats to refresh
      window.dispatchEvent(new Event('task-stats-should-refresh'));
    } catch (error: any) {
      setError(error.message);
    }
  };

  const toggleTaskComplete = async (taskId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          completed: !completed,
          updated_at: new Date().toISOString(),
        })
        .eq('id', taskId);

      if (error) throw error;

      // Optimistic update with animation
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, completed: !completed } : task
      ));

      // Notify stats to refresh
      window.dispatchEvent(new Event('task-stats-should-refresh'));
    } catch (error: any) {
      setError(error.message);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      // Optimistically update the UI
      setTasks(prev => prev.filter(task => task.id !== taskId));

      toast({
        title: "Task deleted",
        description: "Your task has been deleted successfully.",
      });
      // Notify stats to refresh
      window.dispatchEvent(new Event('task-stats-should-refresh'));
    } catch (error: any) {
      setError(error.message);
    }
  };

  const startEditing = (task: Task) => {
    setEditing(task.id);
    setEditTask({ title: task.title, description: task.description || '' });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ListTodo className="h-5 w-5" />
              Tasks
            </CardTitle>
            <CardDescription>
              Manage your tasks and track your progress
            </CardDescription>
          </div>
          <Button
            onClick={() => setAdding(true)}
            className="flex items-center gap-2"
            disabled={adding}
          >
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {adding && (
          <Card className="border-dashed">
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-task-title">Task Title</Label>
                <Input
                  id="new-task-title"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter task title"
                  aria-label="New task title"
                  disabled={submitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-task-description">Description (Optional)</Label>
                <Textarea
                  id="new-task-description"
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter task description"
                  rows={3}
                  aria-label="New task description"
                  disabled={submitting}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={addTask} 
                  className="flex items-center gap-2"
                  disabled={submitting || !newTask.title.trim()}
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {submitting ? 'Saving...' : 'Save Task'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setAdding(false);
                    setNewTask({ title: '', description: '' });
                  }}
                  className="flex items-center gap-2"
                  disabled={submitting}
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ListTodo className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No tasks yet. Add your first task to get started!</p>
            </div>
          ) : (
            tasks.map((task) => (
              <Card 
                key={task.id} 
                className={`transition-all duration-200 ${
                  task.completed ? 'opacity-75 bg-muted/50' : ''
                }`}
              >
                <CardContent className="pt-4">
                  {editing === task.id ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`edit-task-title-${task.id}`}>Task Title</Label>
                        <Input
                          id={`edit-task-title-${task.id}`}
                          value={editTask.title}
                          onChange={(e) => setEditTask(prev => ({ ...prev, title: e.target.value }))}
                          aria-label="Edit task title"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`edit-task-description-${task.id}`}>Description</Label>
                        <Textarea
                          id={`edit-task-description-${task.id}`}
                          value={editTask.description}
                          onChange={(e) => setEditTask(prev => ({ ...prev, description: e.target.value }))}
                          rows={3}
                          aria-label="Edit task description"
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => updateTask(task.id)}
                          className="flex items-center gap-2"
                        >
                          <Save className="h-4 w-4" />
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setEditing(null)}
                          className="flex items-center gap-2"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleTaskComplete(task.id, task.completed)}
                        className="mt-1 p-0 h-auto hover:bg-transparent"
                        aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                      >
                        {task.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500 transition-all duration-200" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                        )}
                      </Button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {task.title}
                          </h4>
                          {task.completed && (
                            <Badge variant="secondary" className="text-xs">
                              Completed
                            </Badge>
                          )}
                        </div>
                        
                        {task.description && (
                          <p className={`text-sm text-muted-foreground ${task.completed ? 'line-through' : ''}`}>
                            {task.description}
                          </p>
                        )}
                        
                        <p className="text-xs text-muted-foreground mt-2">
                          Created {new Date(task.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditing(task)}
                          className="h-8 w-8 p-0"
                          aria-label="Edit task"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTask(task.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          aria-label="Delete task"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
