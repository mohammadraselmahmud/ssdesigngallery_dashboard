"use client";

import { Button, Empty, Pagination, Table } from "antd";
import categoryImg from "@/assets/images/categoryImage.jpeg";
import CategoryCard from "./CategoryCard";
import { useState } from "react";
import AddCategoryModal from "./AddCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import { PlusCircle } from "lucide-react";
import {
  useDeleteCategoryMutation,
  useEditCategoryMutation,
  useGetAllCategoriesQuery,
} from "@/redux/api/categoryApi";
import { ConfigProvider } from "antd";
import { Input } from "antd";
import { Search } from "lucide-react"; 
import { errorToast, successToast } from "@/utils/customToast"; 
import PageLoader from "@/components/shared/PageLoader/PageLoader";
import EmptyContainer from "@/components/EmptyContainer/EmptyContainer";

export default function CategoriesContainer() {
  const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
  const [editCategoryModalOpen, setEditCategoryModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  // Get all categories
  const query= {}
  query["page"]=page
  query["limit"]=limit
  query["searchTerm"]=searchTerm
  const { data: categoriesRes, isLoading } = useGetAllCategoriesQuery(query); 
  const categories = categoriesRes?.data?.data || []; 
  const categoryMeta = categoriesRes?.data?.meta                

  // Delete category
  const [deleteCategory] = useDeleteCategoryMutation();
  const handleDeleteCategory = async (id) => { 
    try {
          await deleteCategory(id).unwrap();
          successToast("Category deleted successfully!");
        } catch (error) {
          errorToast(error?.message || error?.data?.message);
        }
  }; 

  // Edit category
    const [editCategory, { isLoading:isEditLoading }] = useEditCategoryMutation(); 
  const handleEditCategory = async (data) => {
  const formData = new FormData();

    if (data.image) {
      const image = data.image[0].originFileObj; 

      formData.append("image", image);
    }
    formData.append("data", JSON.stringify(data));
    try {
      await editCategory({ id: selectedCategory?._id, data:formData }).unwrap();
      successToast("Category updated successfully!");
      setEditCategoryModalOpen(false);
    } catch (error) { 
      errorToast(error?.message || error?.data?.message);
    }
  }; 
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#322b25",
          colorInfo: "#322b25",
        },
      }}
    >
      <Button
        type="primary"
        size="large"
        icon={<PlusCircle />}
        onClick={() => setAddCategoryModalOpen(true)}
        className="!w-full !py-6"
      >
        Create Category
      </Button>
              <section className="mt-6 space-y-6">
                <div className="flex-center-between mb-4 px-1">
                  <h3 className="mb-4 text-2xl font-semibold text-white">
                    Categories List
                  </h3>
      
                  <Input
                    placeholder="Search by product name"
                    prefix={<Search className="mr-2 text-muted" size={18} />}
                    className="h-10 !w-1/2 !rounded-lg !border !text-base lg:!w-1/3 2xl:!w-1/4"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
 

       {isLoading ? (
              <PageLoader />
            ) :   categories?.length > 0 ? (
      
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {categories?.map((category) => (
                  <CategoryCard category={category} key={category?._id}  setEditCategoryModalOpen={setEditCategoryModalOpen} handleDelete={handleDeleteCategory} setSelectedCategory={setSelectedCategory}/>
                  ))}
                </div>
            ) : (
              <EmptyContainer />
            )}
              </section>
      
            {/* Pagination */}
            <div className="ml-auto mt-6 w-max">
              <Pagination
                pageSize={limit}
                current={page}
                showSizeChanger
                pageSizeOptions={["5",'10', '20', '50', '100']}
                onChange={(page, pageSize) => (setPage(page), setLimit(pageSize))}
                total={categoryMeta?.total}
                
              />
            </div>

 

      <AddCategoryModal
        open={addCategoryModalOpen}
        setOpen={setAddCategoryModalOpen}
      />

      <EditCategoryModal
        open={editCategoryModalOpen}
        handleEditCategory={handleEditCategory}
        setOpen={setEditCategoryModalOpen}
        selectedCategory={selectedCategory}
        isLoading={isEditLoading}

      />
    </ConfigProvider>
  );
}
