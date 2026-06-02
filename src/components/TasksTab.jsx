import React, { useState, useRef } from 'react';

// Recursive Tree Node Component
const TreeNode = ({ node, level, activeFolder, setActiveFolder, onToggleExpand }) => {
  const isExpanded = node.isExpanded;
  const isActive = activeFolder === node.id;
  const paddingLeft = level === 0 ? 0 : 16;

  const handleToggle = (e) => {
    e.stopPropagation();
    onToggleExpand(node.id);
  };

  const handleSelect = () => {
    setActiveFolder(node.id);
  };

  return (
    <div className={`tree-node-item ${isExpanded ? 'expanded' : ''}`} style={{ marginLeft: paddingLeft }}>
      <div 
        className={`tree-node-header ${isActive ? 'active' : ''}`}
        onClick={handleSelect}
      >
        <div className="tree-arrow" onClick={handleToggle}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
        <div className="tree-folder-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
        </div>
        <span className="tree-folder-title">{node.title}</span>
        {node.taskCount > 0 && <span className="tree-folder-count">{node.taskCount}</span>}
      </div>
      
      {node.children && node.children.length > 0 && (
        <div className="tree-sub-tasks">
          {node.children.map(child => (
            <TreeNode 
              key={child.id} 
              node={child} 
              level={level + 1} 
              activeFolder={activeFolder} 
              setActiveFolder={setActiveFolder}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Draggable Task List Item
const DraggableTaskItem = ({ task, index, moveTask, toggleTask, deleteTask, updateTaskTitle }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);
  const itemRef = useRef(null);

  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index);
    setTimeout(() => {
      if (itemRef.current) itemRef.current.classList.add('dragging');
    }, 0);
  };

  const handleDragEnd = () => {
    if (itemRef.current) itemRef.current.classList.remove('dragging');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (sourceIndex !== index && !isNaN(sourceIndex)) {
      moveTask(sourceIndex, index);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      updateTaskTitle(task.id, editValue);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(task.title);
    }
  };

  const priorityClass = task.priority === 'high' ? 'priority-high' : task.priority === 'medium' ? 'priority-medium' : 'priority-low';

  return (
    <div 
      ref={itemRef}
      className={`draggable-item ${task.completed ? 'completed' : ''}`}
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="drag-handle" title="Drag to reorder">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>
      </div>
      
      <label className="task-list-checkbox">
        <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} />
        <span className="task-list-checkmark"></span>
      </label>

      {isEditing ? (
        <input 
          autoFocus
          className="task-inline-edit-input"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={() => { setIsEditing(false); updateTaskTitle(task.id, editValue); }}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <span className="task-list-title" onDoubleClick={() => setIsEditing(true)} title="Double-click to edit">
          {task.title}
        </span>
      )}

      <span className={`priority-badge ${priorityClass}`}>{task.priority}</span>

      <button className="btn-task-delete" onClick={() => deleteTask(task.id)} title="Delete Task">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  );
};


export default function TasksTab({ treeFolders, setTreeFolders, tasksList, setTasksList }) {
  const [activeFolder, setActiveFolder] = useState('f-1');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');

  // Tree functions
  const toggleExpand = (folderId) => {
    const toggleRecursive = (nodes) => {
      return nodes.map(node => {
        if (node.id === folderId) {
          return { ...node, isExpanded: !node.isExpanded };
        }
        if (node.children) {
          return { ...node, children: toggleRecursive(node.children) };
        }
        return node;
      });
    };
    setTreeFolders(toggleRecursive(treeFolders));
  };

  // List functions
  const activeTasks = tasksList.filter(t => t.folderId === activeFolder);
  const activeFolderData = findFolder(treeFolders, activeFolder);

  function findFolder(nodes, id) {
    for (let node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findFolder(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  const moveTask = (fromIndex, toIndex) => {
    const newTasksList = [...tasksList];
    const folderTasks = newTasksList.filter(t => t.folderId === activeFolder);
    const otherTasks = newTasksList.filter(t => t.folderId !== activeFolder);
    
    const [moved] = folderTasks.splice(fromIndex, 1);
    folderTasks.splice(toIndex, 0, moved);
    
    setTasksList([...folderTasks, ...otherTasks]);
  };

  const toggleTask = (id) => {
    setTasksList(tasksList.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasksList(tasksList.filter(t => t.id !== id));
  };

  const updateTaskTitle = (id, newTitle) => {
    if (!newTitle.trim()) return;
    setTasksList(tasksList.map(t => t.id === id ? { ...t, title: newTitle.trim() } : t));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask = {
      id: `tsk-${Date.now()}`,
      folderId: activeFolder,
      title: newTaskTitle.trim(),
      priority: newTaskPriority,
      completed: false
    };

    setTasksList([newTask, ...tasksList]);
    setNewTaskTitle('');
  };

  return (
    <div className="view-panel active">
      <div className="view-header-module">
        <div className="title-meta">PROJECT WORKSPACE</div>
        <h1 className="view-title">Tasks & Objectives</h1>
      </div>

      <div className="tasks-tab-container">
        
        {/* Left Tree Panel */}
        <div className="tree-panel-aside bento-card">
          <div className="card-header border-none" style={{ marginBottom: '8px', paddingBottom: '0' }}>
            <h2 className="card-title" style={{ fontSize: '1rem' }}>Project Folders</h2>
          </div>
          <div className="tree-list-wrapper">
            {treeFolders.map(node => (
              <TreeNode 
                key={node.id} 
                node={node} 
                level={0} 
                activeFolder={activeFolder}
                setActiveFolder={setActiveFolder}
                onToggleExpand={toggleExpand}
              />
            ))}
          </div>
        </div>

        {/* Right List Panel */}
        <div className="react-list-panel bento-card">
          <div className="task-list-title-bar">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="active-folder-label">{activeFolderData ? activeFolderData.title : 'Selected Folder'}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{activeTasks.length} total tasks inside</span>
            </div>
          </div>

          <div className="staggered-list-container scrollable-body">
            {activeTasks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                No active tasks in this folder. Add one below.
              </div>
            ) : (
              activeTasks.map((task, index) => (
                <DraggableTaskItem 
                  key={task.id}
                  task={task}
                  index={index}
                  moveTask={moveTask}
                  toggleTask={toggleTask}
                  deleteTask={deleteTask}
                  updateTaskTitle={updateTaskTitle}
                />
              ))
            )}
          </div>

          {/* Add Task Form */}
          <form className="task-add-bar-form" onSubmit={handleAddTask}>
            <input 
              type="text" 
              placeholder="Draft a new task..." 
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
              required
            />
            <select value={newTaskPriority} onChange={e => setNewTaskPriority(e.target.value)}>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            <button type="submit">Add</button>
          </form>
        </div>

      </div>
    </div>
  );
}
