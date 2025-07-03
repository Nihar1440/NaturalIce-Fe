import React from 'react'
import { Plus, Edit, Trash2, PackageOpen, XCircle, CheckCircle2, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';

const ManageCategory = () => {
  const [isAddEditModalOpen, setIsAddEditModalOpen] = React.useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState(null);
  const [categoryToDelete, setCategoryToDelete] = React.useState(null);

  const [categoryName, setCategoryName] = React.useState('');
  const [categoryDescription, setCategoryDescription] = React.useState('');
  const [categoryStatus, setCategoryStatus] = React.useState('Active');

  const categories = [
    {
      id: 1,
      category: 'round neck t-shirts',
      description: 'printed cotton round neck men\'s t-shirt',
      status: 'Active',
      created: 'May 26, 2025',
      updated: 'Jun 30, 2025',
    },
    {
      id: 2,
      category: 'trousers',
      description: 'structured blended fabric regular fit men\'s f...',
      status: 'Active',
      created: 'May 26, 2025',
      updated: 'Jul 3, 2025',
    },
    {
      id: 3,
      category: 'pants',
      description: 'comfortable and streachable',
      status: 'Inactive',
      created: 'May 28, 2025',
      updated: 'Jun 30, 2025',
    },
  ];

  const loading = false;
  const hasCategories = categories && categories.length > 0;

  const handleAddCategoryClick = () => {
    setEditingCategory(null);
    setCategoryName('');
    setCategoryDescription('');
    setCategoryStatus('Active');
    setIsAddEditModalOpen(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setCategoryName(category.category);
    setCategoryDescription(category.description);
    setCategoryStatus(category.status);
    setIsAddEditModalOpen(true);
  };

  const handleSubmitCategory = () => {
    if (editingCategory) {
      console.log('Updating category:', { ...editingCategory, category: categoryName, description: categoryDescription, status: categoryStatus });
    } else {
      console.log('Creating new category:', { category: categoryName, description: categoryDescription, status: categoryStatus });
    }
    setIsAddEditModalOpen(false);
  };

  const handleDelete = (category) => {
    setCategoryToDelete(category);
    setIsDeleteConfirmModalOpen(true);
  };

  const confirmDelete = () => {
    console.log('Deleting category:', categoryToDelete);
    setCategoryToDelete(null);
    setIsDeleteConfirmModalOpen(false);
  };

  const handleToggleStatus = (category) => {
    console.log('Toggle status for category:', category);
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
        <div className="flex items-center space-x-1">
          <Dialog open={isAddEditModalOpen} onOpenChange={setIsAddEditModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddCategoryClick}>
                <Plus className="mr-1 h-4 w-4" /> Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingCategory ? 'Edit Category' : 'Create New Category'}</DialogTitle>
                <DialogDescription>
                  {editingCategory ? 'Make changes to your category here.' : 'Add a new category to your application.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="categoryName" className="text-left">
                    Category Name
                  </Label>
                  <Input
                    id="categoryName"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="Enter category name"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-left">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={categoryDescription}
                    onChange={(e) => setCategoryDescription(e.target.value)}
                    placeholder="Enter category description"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-left">
                    Status
                  </Label>
                  <Select value={categoryStatus} onValueChange={setCategoryStatus}>
                    <SelectTrigger id="status" className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" onClick={handleSubmitCategory}>
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <p className="text-muted-foreground">Manage your application categories</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevrons-down"><path d="m7 6 5 5 5-5"/><path d="m7 13 5 5 5-5"/></svg>
            </div>
            <p className="text-sm font-medium">Total Categories</p>
          </div>
          <div className="mt-2 text-2xl font-bold">{categories.length}</div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle-2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
            </div>
            <p className="text-sm font-medium">Active Categories</p>
          </div>
          <div className="mt-2 text-2xl font-bold">{categories.filter(cat => cat.status === 'Active').length}</div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-circle"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
            </div>
            <p className="text-sm font-medium">Inactive Categories</p>
          </div>
          <div className="mt-2 text-2xl font-bold">{categories.filter(cat => cat.status === 'Inactive').length}</div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 py-4">
        <div className="relative w-full md:max-w-sm">
          <Input
            placeholder="Search categories..."
            className="pl-10"
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
        </div>
        <Select>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="p-4 lg:p-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading categories...</p>
            </div>
          </div>
        ) : !hasCategories ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <PackageOpen className="h-16 w-16 mb-4 text-gray-400" />
            <p className="text-xl font-semibold mb-2">No categories found</p>
            <p className="text-md">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="border-b border-gray-200 text-left">
                    <th className="px-6 py-3 text-sm font-medium text-gray-700 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-sm font-medium text-gray-700 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-sm font-medium text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-sm font-medium text-gray-700 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-sm font-medium text-gray-700 uppercase tracking-wider">Updated</th>
                    <th className="px-6 py-3 text-sm font-medium text-gray-700 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr
                      key={category.id}
                      className="border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {category.category}
                      </td>
                      <td className="px-6 py-4 text-gray-700 truncate max-w-xs">
                        {category.description}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${category.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {category.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {category.created}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {category.updated}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2 justify-end">
                          <span
                            className="cursor-pointer text-blue-600 hover:text-blue-800 p-1 rounded-md hover:bg-blue-50 transition-colors"
                            onClick={() => handleEdit(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </span>
                          <span
                            className={`cursor-pointer p-1 rounded-md transition-colors ${category.status === 'Active' ? 'text-red-600 hover:text-red-800 hover:bg-red-50' : 'text-green-600 hover:text-green-800 hover:bg-green-50'}`}
                            onClick={() => handleToggleStatus(category)}
                          >
                            {category.status === 'Active' ? (
                              <XCircle className="h-4 w-4" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4" />
                            )}
                          </span>
                          <span
                            className="cursor-pointer text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-50 transition-colors"
                            onClick={() => handleDelete(category)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <Dialog open={isDeleteConfirmModalOpen} onOpenChange={setIsDeleteConfirmModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the category "{categoryToDelete?.category}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageCategory
