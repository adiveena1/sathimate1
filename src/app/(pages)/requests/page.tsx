
'use client';

import React from 'react';
import { useFirestore, useCollection, useUser } from '@/firebase';
import { collection, query, where, DocumentData } from 'firebase/firestore';
import { ConnectionRequest, connectionService } from '@/services/connection-service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, Clock, Send, MessageCircle, User, Loader2, Sparkles, Navigation } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ChatDialog } from '@/components/chat/ChatDialog';

const formatRequestDate = (createdAt: any) => {
  try {
    if (!createdAt) return 'recently';
    if (typeof createdAt === 'object' && createdAt.toDate) {
      return formatDistanceToNow(createdAt.toDate());
    }
    if (typeof createdAt === 'number') {
      return formatDistanceToNow(new Date(createdAt));
    }
    return formatDistanceToNow(new Date(createdAt));
  } catch (e) {
    return 'recently';
  }
};

export default function RequestsPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const incomingQuery = React.useMemo(() => 
    db && user ? query(collection(db, 'requests'), where('receiverId', '==', user.uid)) : null
  , [db, user]);

  const outgoingQuery = React.useMemo(() => 
    db && user ? query(collection(db, 'requests'), where('senderId', '==', user.uid)) : null
  , [db, user]);

  const { data: incomingRaw, loading: incLoading } = useCollection(incomingQuery);
  const { data: outgoingRaw, loading: outLoading } = useCollection(outgoingQuery);
  
  const incoming = (incomingRaw as ConnectionRequest[]) || [];
  const outgoing = (outgoingRaw as ConnectionRequest[]) || [];

  const handleStatusChange = async (id: string, status: 'accepted' | 'rejected') => {
    try {
      await connectionService.updateStatus(id, status);
      toast({
        title: status === 'accepted' ? "Connection Accepted!" : "Request Declined",
        description: status === 'accepted' ? "You can now chat with your new sathi." : "The request has been removed.",
      });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to update request." });
    }
  };

  if (incLoading || outLoading) return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCF9]">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFCF9] pb-24">
       <section className="bg-white border-b border-muted/20 pt-20 pb-16">
          <div className="container mx-auto px-6 max-w-4xl space-y-4">
               <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                    <Sparkles className="h-3 w-3" /> Notifications & Requests
               </div>
               <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl font-headline">Your Travel <span className="text-primary italic">Circle</span></h1>
               <p className="text-muted-foreground text-lg max-w-xl">Manage your connection requests and start collaborating on your next big adventure.</p>
          </div>
       </section>

       <main className="container mx-auto px-6 max-w-4xl py-12">
            <Tabs defaultValue="incoming" className="w-full">
                <TabsList className="h-14 p-1 rounded-2xl bg-muted/20 border border-muted/10 mb-10">
                    <TabsTrigger value="incoming" className="h-full px-8 rounded-xl font-bold gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        Incoming <Badge variant="secondary" className="ml-1 bg-white/20 text-current">{incoming?.length || 0}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="outgoing" className="h-full px-8 rounded-xl font-bold gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        Sent <Badge variant="secondary" className="ml-1 bg-white/20 text-current">{outgoing?.length || 0}</Badge>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="incoming" className="space-y-6">
                    {incoming && incoming.length > 0 ? (
                        incoming.sort((a,b) => b.updatedAt - a.updatedAt).map(req => (
                            <Card key={req.id} className="rounded-3xl border-none shadow-sm shadow-black/5 overflow-hidden group hover:shadow-xl transition-all duration-300 bg-white">
                                <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
                                     <Avatar className="h-16 w-16 border-2 border-primary/20 group-hover:scale-105 transition-transform">
                                          <AvatarImage src={req.senderPhoto} />
                                          <AvatarFallback><User /></AvatarFallback>
                                     </Avatar>
                                     <div className="flex-1 text-center md:text-left">
                                          <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                                               <h3 className="text-lg font-bold">{req.senderName}</h3>
                                               <span className="text-xs sm:text-[10px] bg-sky-50 text-sky-600 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">Wants to Connect</span>
                                          </div>
                                          <p className="text-sm text-muted-foreground mb-4">
                                               Requested {formatRequestDate(req.createdAt)} ago
                                          </p>
                                          
                                          {req.status === 'pending' ? (
                                              <div className="flex items-center justify-center md:justify-start gap-4">
                                                   <Button 
                                                       onClick={() => handleStatusChange(req.id!, 'accepted')}
                                                       className="rounded-xl h-10 px-6 font-bold shadow-lg shadow-primary/20"
                                                   >
                                                       <Check className="h-4 w-4 mr-2" /> Accept
                                                   </Button>
                                                   <Button 
                                                       variant="ghost" 
                                                       onClick={() => handleStatusChange(req.id!, 'rejected')}
                                                       className="rounded-xl h-10 px-6 font-bold text-destructive hover:bg-destructive/10"
                                                   >
                                                       <X className="h-4 w-4 mr-2" /> Decline
                                                   </Button>
                                              </div>
                                          ) : (
                                              <div className="flex items-center justify-center md:justify-start gap-3">
                                                   <Badge variant={req.status === 'accepted' ? 'default' : 'secondary'} className="px-3 py-1 font-bold rounded-full">
                                                        {req.status === 'accepted' ? 'Connected' : 'Declined'}
                                                   </Badge>
                                                   {req.status === 'accepted' && (
                                                       <ChatDialog 
                                                           receiverUid={req.senderId} 
                                                           receiverName={req.senderName} 
                                                           receiverPhoto={req.senderPhoto}
                                                           trigger={
                                                              <Button variant="outline" className="rounded-xl h-9 text-xs font-black shadow-sm group">
                                                                  <MessageCircle className="h-3 w-3 mr-2 group-hover:scale-110 transition-transform" /> Start Discussing
                                                              </Button>
                                                           }
                                                       />
                                                   )}
                                              </div>
                                          )}
                                     </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-muted/5 rounded-3xl border-2 border-dashed border-muted/20">
                             <div className="h-16 w-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                  <Clock className="h-8 w-8 text-muted-foreground" />
                             </div>
                             <h3 className="font-bold text-xl">No incoming requests yet</h3>
                             <p className="text-muted-foreground max-w-xs mx-auto mt-2">When someone wants to connect with you, their request will appear here.</p>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="outgoing" className="space-y-6">
                    {outgoing && outgoing.length > 0 ? (
                        outgoing.sort((a,b) => b.updatedAt - a.updatedAt).map(req => (
                            <Card key={req.id} className="rounded-3xl border-muted/20 bg-muted/5">
                                <CardContent className="p-6 flex items-center justify-between">
                                     <div className="flex items-center gap-4">
                                          <Avatar className="h-12 w-12 opacity-80">
                                               <AvatarFallback><User /></AvatarFallback>
                                          </Avatar>
                                          <div>
                                               <h3 className="font-bold">Request Sent to Traveler</h3>
                                               <p className="text-xs text-muted-foreground">Sent {formatRequestDate(req.createdAt)} ago</p>
                                          </div>
                                     </div>
                                     <div>
                                          <Badge variant={req.status === 'pending' ? 'secondary' : req.status === 'accepted' ? 'default' : 'destructive'} className="rounded-full px-4 font-black text-xs sm:text-[10px] uppercase tracking-widest">
                                               {req.status}
                                          </Badge>
                                     </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-muted/5 rounded-3xl border-2 border-dashed border-muted/20">
                             <div className="h-16 w-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                  <Send className="h-8 w-8 text-muted-foreground" />
                             </div>
                             <h3 className="font-bold text-xl">You haven't sent any requests</h3>
                             <p className="text-muted-foreground max-w-xs mx-auto mt-2 text-sm">Find your travel partners by exploring our community of adventurers.</p>
                             <Button asChild className="mt-8 rounded-xl font-bold">
                                  <a href="/search">Find Your Sathi</a>
                             </Button>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
       </main>
    </div>
  );
}
