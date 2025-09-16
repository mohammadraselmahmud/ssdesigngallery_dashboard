"use client";
import { useDeleteProductMutation, useEditProductMutation, useGetAllProductsQuery } from "@/redux/api/productsApi";
import { Button, Pagination } from "antd";
import { PlusCircle } from "lucide-react";
import ProductCard from "./ProductCard";
import { useState } from "react";
import EditProductModal from "./EditProductModal";
import AddProductModal from "./AddProductModal";
import { Input } from "antd";
import { Search } from "lucide-react";
import PageLoader from "@/components/shared/PageLoader/PageLoader";
import EmptyContainer from "@/components/EmptyContainer/EmptyContainer";
import { useGetAllCategoriesQuery } from "@/redux/api/categoryApi";
import { errorToast, successToast } from "@/utils/customToast";
import { ConfirmModal } from "@/utils/modalHook";

export default function ProductsContainer() {
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [searchText, setSearchText] = useState("");

  const { data: categoryRes } = useGetAllCategoriesQuery({ limit: 99999 });
  const categories = categoryRes?.data?.data || [];

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const query = {}
  query["page"]=currentPage
  query["limit"]=limit
  query["searchTerm"]= searchText
  // Get all products
  const { data: productsRes, isLoading } = useGetAllProductsQuery(query);
 
  const products = productsRes?.data?.data || []; 
  const productsMeta = productsRes?.data?.meta || {}; 

 
  
    // Delete product
    const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  
    const handleDeleteProduct = (id) => {
      ConfirmModal(
        "Are you sure?",
        "This product will be permanently deleted.",
      ).then(async (res) => {
        if (res.isConfirmed) {
          try {
            await deleteProduct(id).unwrap();
  
            successToast("Product deleted successfully!");
          } catch (error) {
            errorToast(error?.message || error?.data?.message);
          }
        }
      });
    };


    //edit product
      const [editProduct, { isLoading: isEditingProduct }] =
        useEditProductMutation();
    
      const handleSubmit = async (data) => { 
        const formData = new FormData();
        if (data.image) {
      const image = data.image[0].originFileObj; 

      formData.append("image", image);
    }
    
         
    
        formData.append("data", JSON.stringify(data));
    
        try {
          await editProduct({ id: selectedProduct?._id, data: formData }).unwrap();
    
          successToast("Product updated successfully!");
          setShowEditProductModal(false);
        } catch (error) {
          errorToast(error?.message || error?.data?.message);
        }
      };


  return (
    <div>
      <Button
        type="primary"
        size="large"
        icon={<PlusCircle size={20} />}
        iconPosition="start"
        className="!w-full !py-6"
        onClick={() => {
          setShowAddProductModal(true);
        }}
      >
        Add new product
      </Button>
<section className="mt-6 space-y-6">
          <div className="flex-center-between mb-4 px-1">
            <h3 className="mb-4 text-2xl font-semibold text-white">
              All Products
            </h3>

            <Input
              placeholder="Search by product name"
              prefix={<Search className="mr-2 text-muted" size={18} />}
              className="h-10 !w-1/2 !rounded-lg !border !text-base lg:!w-1/3 2xl:!w-1/4"
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
      {/* Products */}
      {isLoading ? (
        <PageLoader />
      ) : products?.length > 0 ? (
        

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products?.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                setShowProductModal={setShowEditProductModal}
                setSelectedProduct={setSelectedProduct}
                isDeleting={isDeleting}
                handleDeleteProduct={handleDeleteProduct}
                
              />
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
          current={currentPage}
          onChange={(page, pageSize) => (setCurrentPage(page), setLimit(pageSize))}
          total={productsMeta.total} 
          showSizeChanger
          pageSizeOptions={["5",'10', '20', '50', '100']}  
        />
      </div>

      <EditProductModal
      categories={categories}
        open={showEditProductModal}
        setOpen={setShowEditProductModal}
        selectedProduct={selectedProduct}
        isLoading={isEditingProduct}
        handleSubmit={handleSubmit}
      />
      <AddProductModal
      categories={categories}
        open={showAddProductModal}
        setOpen={setShowAddProductModal} 
      />
    </div>
  );
}
