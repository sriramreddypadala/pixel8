/**
 * CONTENT MANAGEMENT PAGE
 * Control visual content used in photo booths
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid, List, Image, Video, Frame, Eye, EyeOff, MapPin, Globe } from 'lucide-react';
import { useContentStore } from '@/store/contentStore';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { MOCK_CONTENT } from '@/utils/mockData';

export function ContentPage() {
  const {
    items,
    loading,
    viewMode,
    filterType,
    filterStatus,
    selectedItem,
    setItems,
    setViewMode,
    setFilterType,
    setFilterStatus,
    setSelectedItem,
    toggleContentStatus,
    getFilteredItems,
  } = useContentStore();

  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    setItems(MOCK_CONTENT);
  }, [setItems]);

  const filteredItems = getFilteredItems();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'background': return Image;
      case 'overlay': return Video;
      case 'frame': return Frame;
      default: return Image;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'background': return 'text-blue-400';
      case 'overlay': return 'text-purple-400';
      case 'frame': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const handlePreview = (item: typeof items[0]) => {
    setSelectedItem(item);
    setShowPreview(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">Content Management</h1>
          <p className="text-gray-400 text-lg">Control visual content used across all photo booths</p>
        </div>

        {/* Controls */}
        <GlassPanel className="p-6 rounded-2xl mb-6" blur="medium" opacity={0.7}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:border-white/40 outline-none"
              >
                <option value="all">All Types</option>
                <option value="background">Backgrounds</option>
                <option value="overlay">Overlays</option>
                <option value="frame">Frames</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:border-white/40 outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>

            {/* Stats */}
            <div className="text-sm text-gray-400">
              Showing <span className="text-white font-semibold">{filteredItems.length}</span> of{' '}
              <span className="text-white font-semibold">{items.length}</span> items
            </div>
          </div>
        </GlassPanel>

        {/* Content Grid/List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredItems.map((item, index) => {
                const TypeIcon = getTypeIcon(item.type);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <GlassPanel
                      className="rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform"
                      blur="medium"
                      opacity={0.7}
                      onClick={() => handlePreview(item)}
                    >
                      {/* Thumbnail */}
                      <div className="relative aspect-video bg-gray-800">
                        <img
                          src={item.thumbnailUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        {item.fileType === 'video' && (
                          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white flex items-center gap-1">
                            <Video className="w-3 h-3" />
                            VIDEO
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-white font-bold text-lg mb-1">{item.name}</h3>
                            <div className="flex items-center gap-2 text-sm">
                              <TypeIcon className={`w-4 h-4 ${getTypeColor(item.type)}`} />
                              <span className="text-gray-400 capitalize">{item.type}</span>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleContentStatus(item.id);
                            }}
                            className={`p-2 rounded-lg transition-all ${
                              item.status === 'active'
                                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                            }`}
                          >
                            {item.status === 'active' ? (
                              <Eye className="w-4 h-4" />
                            ) : (
                              <EyeOff className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        {/* Assignment */}
                        <div className="flex items-center gap-2 text-sm">
                          {item.assignment === 'all' ? (
                            <>
                              <Globe className="w-4 h-4 text-blue-400" />
                              <span className="text-gray-400">All Booths</span>
                            </>
                          ) : (
                            <>
                              <MapPin className="w-4 h-4 text-purple-400" />
                              <span className="text-gray-400">
                                {item.assignedBoothIds.length} Booth{item.assignedBoothIds.length !== 1 ? 's' : ''}
                              </span>
                            </>
                          )}
                        </div>

                        {/* File Size */}
                        <div className="mt-3 pt-3 border-t border-white/10 text-xs text-gray-500">
                          {formatFileSize(item.fileSize)}
                        </div>
                      </div>
                    </GlassPanel>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <GlassPanel className="rounded-2xl overflow-hidden" blur="medium" opacity={0.7}>
            <div className="divide-y divide-white/10">
              {filteredItems.map((item) => {
                const TypeIcon = getTypeIcon(item.type);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => handlePreview(item)}
                  >
                    <div className="flex items-center gap-4">
                      {/* Thumbnail */}
                      <img
                        src={item.thumbnailUrl}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />

                      {/* Info */}
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-1">{item.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <TypeIcon className={`w-4 h-4 ${getTypeColor(item.type)}`} />
                            <span className="capitalize">{item.type}</span>
                          </div>
                          <span>•</span>
                          <span>{formatFileSize(item.fileSize)}</span>
                          <span>•</span>
                          {item.assignment === 'all' ? (
                            <div className="flex items-center gap-1">
                              <Globe className="w-4 h-4 text-blue-400" />
                              <span>All Booths</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-purple-400" />
                              <span>{item.assignedBoothIds.length} Booths</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Status Toggle */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleContentStatus(item.id);
                        }}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                          item.status === 'active'
                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                        }`}
                      >
                        {item.status === 'active' ? 'Active' : 'Disabled'}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </GlassPanel>
        )}

        {/* Preview Modal */}
        <AnimatePresence>
          {showPreview && selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8"
              onClick={() => setShowPreview(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-4xl w-full"
              >
                <GlassPanel className="rounded-2xl p-6" blur="heavy" opacity={0.9}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-black text-white mb-1">{selectedItem.name}</h2>
                      <p className="text-gray-400 capitalize">{selectedItem.type}</p>
                    </div>
                    <button
                      onClick={() => setShowPreview(false)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  <img
                    src={selectedItem.fileUrl}
                    alt={selectedItem.name}
                    className="w-full rounded-lg mb-4"
                  />

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Status:</span>
                      <span className={`ml-2 font-semibold ${
                        selectedItem.status === 'active' ? 'text-green-400' : 'text-gray-400'
                      }`}>
                        {selectedItem.status === 'active' ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">File Size:</span>
                      <span className="ml-2 text-white">{formatFileSize(selectedItem.fileSize)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Assignment:</span>
                      <span className="ml-2 text-white">
                        {selectedItem.assignment === 'all' ? 'All Booths' : `${selectedItem.assignedBoothIds.length} Booths`}
                      </span>
                    </div>
                    {selectedItem.dimensions && (
                      <div>
                        <span className="text-gray-400">Dimensions:</span>
                        <span className="ml-2 text-white">
                          {selectedItem.dimensions.width} × {selectedItem.dimensions.height}
                        </span>
                      </div>
                    )}
                  </div>
                </GlassPanel>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
