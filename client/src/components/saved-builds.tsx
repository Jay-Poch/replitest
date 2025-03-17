import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Build } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Loader2, Trash2 } from "lucide-react";
import { useBuild } from "@/lib/hooks/use-build";
import { useToast } from "@/hooks/use-toast";

interface SavedBuildsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SavedBuilds({ open, onOpenChange }: SavedBuildsProps) {
  const { toast } = useToast();
  const { loadBuildById } = useBuild();
  const [loadingBuildId, setLoadingBuildId] = useState<number | null>(null);
  
  // Fetch saved builds
  const { data: builds, isLoading } = useQuery({
    queryKey: ["/api/builds"],
    enabled: open
  });
  
  // Delete build mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/builds/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/builds"] });
      toast({
        title: "Build Deleted",
        description: "The build has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Delete Failed",
        description: "There was an error deleting the build.",
        variant: "destructive",
      });
    }
  });
  
  const handleLoadBuild = async (buildId: number) => {
    try {
      setLoadingBuildId(buildId);
      await loadBuildById(buildId);
      onOpenChange(false);
      toast({
        title: "Build Loaded",
        description: "The build has been loaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Load Failed",
        description: "There was an error loading the build.",
        variant: "destructive",
      });
    } finally {
      setLoadingBuildId(null);
    }
  };
  
  const handleDeleteBuild = (id: number) => {
    if (window.confirm("Are you sure you want to delete this build?")) {
      deleteMutation.mutate(id);
    }
  };
  
  // Format date string
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Saved Builds</DialogTitle>
          <DialogDescription>
            Access your previously saved builds.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-6 flow-root">
          {isLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !builds || builds.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <svg className="h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No saved builds</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a build.</p>
            </div>
          ) : (
            <ul role="list" className="divide-y divide-gray-200">
              {builds.map((build: Build) => (
                <li key={build.id} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{build.name}</p>
                      <p className="text-sm text-gray-500 truncate">Created: {formatDate(build.createdAt)}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-full"
                        onClick={() => handleLoadBuild(build.id)}
                        disabled={loadingBuildId === build.id}
                      >
                        {loadingBuildId === build.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : "Load"}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="rounded-full"
                        onClick={() => handleDeleteBuild(build.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="default" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
