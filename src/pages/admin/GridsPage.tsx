import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Copy, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GridBuilderModal } from '@/components/admin/GridBuilder/GridBuilderModal';
import { useGridStore } from '@/store/gridStore';
import { useMachineStore } from '@/store/machineStore';
import { listContainerVariants, listItemVariants } from '@/utils/motion';
import { formatDate } from '@/utils/helpers';

export function GridsPage() {
  const {
    templates,
    activeGrid,
    pendingGrid,
    isSessionActive,
    setActiveGrid,
    deleteTemplate,
    duplicateTemplate,
    openGridBuilder,
    closeGridBuilder,
    isGridBuilderOpen,
    selectedTemplateId,
    setSelectedTemplate,
  } = useGridStore();

  const { session } = useMachineStore();

  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleActivateGrid = (templateId: string) => {
    setActiveGrid(templateId);
  };

  const handleEditGrid = (templateId: string) => {
    setSelectedTemplate(templateId);
    openGridBuilder();
  };

  const handleDeleteGrid = (templateId: string) => {
    if (confirmDelete === templateId) {
      deleteTemplate(templateId);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(templateId);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  const handleDuplicateGrid = (templateId: string) => {
    duplicateTemplate(templateId);
  };

  const handleCreateNew = () => {
    setSelectedTemplate(null);
    openGridBuilder();
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Grid Templates
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Create and manage photo layout grids
            </p>
          </div>
          <Button onClick={handleCreateNew}>
            <Plus className="w-5 h-5 mr-2" />
            Create Grid
          </Button>
        </div>

        {/* Session Status Alert */}
        {isSessionActive && pendingGrid && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <div>
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">
                  Grid Change Pending
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  <strong>{pendingGrid.name}</strong> will be applied after the current session ends
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Active Grid Indicator */}
        {activeGrid && (
          <div className="mb-6 p-4 bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-200 dark:border-primary-800 rounded-xl">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <div>
                <h3 className="font-semibold text-primary-900 dark:text-primary-100">
                  Active Grid
                </h3>
                <p className="text-sm text-primary-700 dark:text-primary-300">
                  <strong>{activeGrid.name}</strong> is currently in use
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Grid Templates List */}
        <motion.div
          variants={listContainerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {templates.map((template) => {
            const isActive = activeGrid?.id === template.id;
            const isPending = pendingGrid?.id === template.id;

            return (
              <motion.div key={template.id} variants={listItemVariants}>
                <Card
                  className={`relative overflow-hidden ${
                    isActive
                      ? 'ring-2 ring-primary-500'
                      : isPending
                      ? 'ring-2 ring-yellow-500'
                      : ''
                  }`}
                >
                  {/* Preview */}
                  <div
                    className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden"
                    style={{
                      aspectRatio: template.aspectRatio.replace(':', '/'),
                      backgroundColor: template.backgroundColor || '#ffffff',
                    }}
                  >
                    {/* Slots Preview */}
                    {template.slots.map((slot) => (
                      <div
                        key={slot.id}
                        className="absolute bg-gray-300 dark:bg-gray-600 border-2 border-dashed border-gray-400 dark:border-gray-500"
                        style={{
                          left: `${slot.x}%`,
                          top: `${slot.y}%`,
                          width: `${slot.width}%`,
                          height: `${slot.height}%`,
                          borderRadius: slot.radius ? `${slot.radius}px` : 0,
                        }}
                      />
                    ))}

                    {/* Status Badge */}
                    {isActive && (
                      <div className="absolute top-2 right-2 bg-primary-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        Active
                      </div>
                    )}
                    {isPending && (
                      <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        Pending
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {template.aspectRatio} • {template.slots.length} photo
                      {template.slots.length !== 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Updated {formatDate(template.updatedAt)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="px-4 pb-4 flex gap-2">
                    {!isActive && (
                      <Button
                        size="sm"
                        onClick={() => handleActivateGrid(template.id)}
                        fullWidth
                      >
                        {isSessionActive ? 'Queue for Next' : 'Activate'}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditGrid(template.id)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDuplicateGrid(template.id)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    {!isActive && (
                      <Button
                        size="sm"
                        variant={confirmDelete === template.id ? 'danger' : 'outline'}
                        onClick={() => handleDeleteGrid(template.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Empty State */}
        {templates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No grid templates yet
            </p>
            <Button onClick={handleCreateNew}>
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Grid
            </Button>
          </div>
        )}
      </div>

      {/* Grid Builder Modal */}
      <GridBuilderModal
        isOpen={isGridBuilderOpen}
        onClose={closeGridBuilder}
        templateId={selectedTemplateId}
      />
    </div>
  );
}
