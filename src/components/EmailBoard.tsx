import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useEmailStore } from '../store/emailStore';
import { Email } from '../types/email';
import { Inbox, Clock, Archive } from 'lucide-react';

const columns = [
  { id: 'todo', title: 'To Do', icon: Inbox },
  { id: 'in-progress', title: 'In Progress', icon: Clock },
  { id: 'done', title: 'Done', icon: Archive }
];

export function EmailBoard() {
  const { emails, updateEmailStatus } = useEmailStore();

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const emailId = result.draggableId;
    const newStatus = result.destination.droppableId as Email['status'];
    updateEmailStatus(emailId, newStatus);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {columns.map((column) => (
          <div key={column.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-4">
              <column.icon className="h-5 w-5 text-indigo-600 mr-2" />
              <h3 className="font-semibold text-gray-900">{column.title}</h3>
            </div>
            
            <Droppable droppableId={column.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-3"
                >
                  {emails
                    .filter((email) => email.status === column.id)
                    .map((email, index) => (
                      <Draggable
                        key={email.id}
                        draggableId={email.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white p-4 rounded shadow-sm"
                          >
                            <h4 className="font-medium text-gray-900">
                              {email.subject}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {email.from}
                            </p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}