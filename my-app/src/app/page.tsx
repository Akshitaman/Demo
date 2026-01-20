"use client";

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useNotes } from '@/hooks/useNotes';
import { useFolders } from '@/hooks/useFolders';
import { Plus, FileText, Search, Grid, List, MoreVertical, Copy, Trash2, Folder as FolderIcon, Clock, ArrowLeft, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get('view');
  const folderId = searchParams.get('folder');

  // If no folderId and no view=folders, we show Recent Files (all notes)
  const isRecentView = !folderId && view !== 'folders';
  const isFoldersView = view === 'folders';
  const isFolderDetailView = !!folderId;

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [gridSize, setGridSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [sortOption, setSortOption] = useState<'alphabetical' | 'number' | 'date'>('date');

  // Determine the context for useNotes: undefined for All (Recent), folderId for specific folder
  const notesContextId = isRecentView ? undefined : folderId;
  const { notes, createNote, deleteNote, copyNote, loading } = useNotes(notesContextId);
  const { folders, createFolder, deleteFolder } = useFolders();

  const currentFolder = folders.find(f => f.id === folderId);

  // Filter and Sort notes and folders
  const filteredNotes = useMemo(() => {
    let result = [...notes];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(n =>
        n.title.toLowerCase().includes(query) ||
        n.cells.some(c => c.content?.toLowerCase().includes(query))
      );
    }

    if (sortOption === 'alphabetical') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === 'number') {
      result.sort((a, b) => {
        const sizeA = a.cells.reduce((acc, c) => acc + (c.content?.length || 0), 0);
        const sizeB = b.cells.reduce((acc, c) => acc + (c.content?.length || 0), 0);
        return sizeB - sizeA; // Descending size
      });
    } else {
      result.sort((a, b) => b.createdAt - a.createdAt);
    }
    return result;
  }, [notes, searchQuery, sortOption]);

  const filteredFolders = useMemo(() => {
    let result = [...folders];
    if (searchQuery) {
      result = result.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (sortOption === 'alphabetical') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }
    return result;
  }, [folders, searchQuery, sortOption]);

  const handleCreateNote = async () => {
    const newNote = await createNote();
    router.push(`/notes/${newNote.id}`);
  };

  const handleOpenNote = (id: string) => {
    router.push(`/notes/${id}`);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-full pb-32 relative">
      <header className="mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {isFolderDetailView && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/?view=folders')}
                className="h-8 w-8"
              >
                <motion.div whileHover={{ x: -2 }}>
                  <ArrowLeft className="h-5 w-5" />
                </motion.div>
              </Button>
            )}
            <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-white to-white/60 bg-clip-text text-transparent">
              {isRecentView ? "Recent Files" : isFoldersView ? "Folders" : currentFolder?.name}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {isSearchOpen ? (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 240, opacity: 1 }}
                className="relative flex items-center"
              >
                <input
                  autoFocus
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-purple-500/50 transition-all pl-8"
                />
                <Search className="absolute left-2.5 h-4 w-4 text-white/40" />
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="absolute right-2 text-white/40 hover:text-white"
                >
                  <X size={14} />
                </button>
              </motion.div>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)} className="text-white/60 hover:text-white"><Search className="h-5 w-5" /></Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white/60 hover:text-white"><Grid className="h-5 w-5" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#0a0a1a] border-white/10 text-white">
                <DropdownMenuItem onClick={() => setSortOption('alphabetical')} className="flex items-center justify-between">
                  Alphabetical {sortOption === 'alphabetical' && <Check className="h-4 w-4 ml-2" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption('number')} className="flex items-center justify-between">
                  By Number {sortOption === 'number' && <Check className="h-4 w-4 ml-2" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption('date')} className="flex items-center justify-between">
                  Date Added {sortOption === 'date' && <Check className="h-4 w-4 ml-2" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white/60 hover:text-white"><MoreVertical className="h-5 w-5" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#0a0a1a] border-white/10 text-white">
                <DropdownMenuItem onClick={() => setGridSize('small')} className="flex items-center justify-between">
                  Grid Small {gridSize === 'small' && <Check className="h-4 w-4 ml-2" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setGridSize('medium')} className="flex items-center justify-between">
                  Grid Medium {gridSize === 'medium' && <Check className="h-4 w-4 ml-2" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setGridSize('large')} className="flex items-center justify-between">
                  Grid Large {gridSize === 'large' && <Check className="h-4 w-4 ml-2" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground border-b border-white/5 pb-2">
          <span className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors capitalize">
            {sortOption === 'date' ? <Clock size={12} className="text-purple-400" /> : null}
            {sortOption === 'alphabetical' ? 'A-Z' : sortOption === 'number' ? 'Size' : 'Date modified'}
          </span>
          <span>|</span>
          <span className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors text-xs opacity-60">
            {sortOption === 'alphabetical' ? 'Ascending' : 'Descending'}
          </span>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className={cn(
            "grid gap-6",
            gridSize === 'small' && "grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8",
            gridSize === 'medium' && "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
            gridSize === 'large' && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          )}
        >
          {/* Folders View Grid */}
          {isFoldersView && (
            <>
              {/* Create Folder Card */}
              <motion.div
                variants={item}
                onClick={() => {
                  const name = prompt("Enter folder name:");
                  if (name) createFolder(name);
                }}
                className="flex flex-col gap-3 group"
              >
                <div className="aspect-4/5 rounded-2xl bg-white/2 border border-dashed border-white/10 p-4 hover:border-purple-500/40 hover:bg-white/4 transition-all cursor-pointer relative flex flex-col items-center justify-center group/card">
                  <div className="p-4 rounded-full bg-white/5 text-white/40 group-hover/card:bg-purple-500/10 group-hover/card:text-purple-400 transition-colors">
                    <Plus className="h-8 w-8" />
                  </div>
                  <p className="mt-4 text-xs font-medium text-white/40 group-hover/card:text-purple-400 transition-colors">New Folder</p>
                </div>
              </motion.div>

              {filteredFolders.map(folder => (
                <motion.div
                  variants={item}
                  key={folder.id}
                  onClick={() => router.push(`/?folder=${folder.id}`)}
                  className="flex flex-col gap-3 group"
                >
                  <div className="aspect-4/5 rounded-2xl bg-white/3 border border-white/10 p-4 hover:border-purple-500/40 hover:bg-white/5 transition-all cursor-pointer relative shadow-lg overflow-hidden flex flex-col items-center justify-center">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/40 backdrop-blur hover:bg-black/60">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#0a0a1a] border-white/10">
                          <DropdownMenuItem
                            onClick={(e) => { e.stopPropagation(); deleteFolder(folder.id); }}
                            className="text-red-400 focus:text-red-300 focus:bg-red-950/30"
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="p-6 rounded-2xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform duration-300">
                      <FolderIcon className="h-12 w-12 opacity-80" />
                    </div>
                    <div className="absolute inset-0 bg-linear-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-center px-2">
                    <h3 className="font-medium text-sm text-foreground/90 truncate">{folder.name}</h3>
                    <p className="text-xs text-muted-foreground/60 mt-0.5">Folder</p>
                  </div>
                </motion.div>
              ))}
            </>
          )}

          {/* Notes Grid (Recent or Folder Detail) */}
          {(isRecentView || isFolderDetailView) && filteredNotes.map(note => (
            <motion.div
              variants={item}
              key={note.id}
              onClick={() => handleOpenNote(note.id)}
              className="flex flex-col gap-3 group animate-in fade-in zoom-in duration-300"
            >
              <div className="aspect-4/5 rounded-2xl bg-white/3 border border-white/10 p-4 hover:border-purple-500/40 hover:bg-white/5 transition-all cursor-pointer relative shadow-lg overflow-hidden">
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/40 backdrop-blur hover:bg-black/60">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#0a0a1a] border-white/10">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); copyNote(note, folderId || undefined); }} className="text-white/70 focus:text-white">
                        <Copy className="h-4 w-4 mr-2" /> Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }} className="text-red-400 focus:text-red-300 focus:bg-red-950/30">
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="h-full w-full opacity-40 overflow-hidden font-mono text-[8px] leading-tight select-none pointer-events-none">
                  <div className="space-y-1">
                    {note.cells?.[0]?.content.split('\n').slice(0, 15).map((line, i) => (
                      <div key={i} className="truncate">{line || '\u00A0'}</div>
                    ))}
                    {!note.cells?.[0]?.content && (
                      <div className="flex items-center justify-center h-full opacity-10">
                        <FileText className="h-12 w-12" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60" />
              </div>
              <div className="text-center px-2">
                <h3 className="font-medium text-sm text-foreground/90 truncate pr-2" title={note.title}>{note.title || 'Untitled'}</h3>
                <p className="text-xs text-muted-foreground/60 mt-0.5">
                  {format(note.createdAt, 'd MMM')}
                </p>
              </div>
            </motion.div>
          ))}

          {/* Empty States */}
          {((isRecentView || isFolderDetailView) && notes.length === 0) && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-40">
              <FileText className="h-12 w-12 mb-4" />
              <p>No notes found</p>
            </div>
          )}
          {(isFoldersView && folders.length === 0) && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-40">
              <Plus className="h-12 w-12 mb-4" />
              <p>No folders created</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button
          size="icon"
          className="h-14 w-14 rounded-2xl shadow-[0_0_30px_rgba(124,58,237,0.4)] bg-purple-600 hover:bg-purple-500 transition-all active:scale-95 group border border-white/10"
          onClick={handleCreateNote}
        >
          <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
        </Button>
      </div>
    </div>
  );
}


