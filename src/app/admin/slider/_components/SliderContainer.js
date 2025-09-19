"use client";

import { Button, Pagination,} from "antd"; 
import CategoryCard from "./SliderCard";
import { useState } from "react";
import AddCategoryModal from "./AddSliderModal";
import EditCategoryModal from "./EditSliderModal";
import { PlusCircle } from "lucide-react"; 
import { ConfigProvider } from "antd"; 
import { errorToast, successToast } from "@/utils/customToast"; 
import PageLoader from "@/components/shared/PageLoader/PageLoader";
import EmptyContainer from "@/components/EmptyContainer/EmptyContainer";  
import { useDeleteSliderMutation, useEditSliderMutation, useGetAllSlidersQuery } from "@/redux/api/sliderApi";
import AddSliderModal from "./AddSliderModal";
import SliderCard from "./SliderCard";

export default function SlidersContainer() {
  const [addSliderModalOpen, setAddSliderModalOpen] = useState(false);
  const [editSliderModalOpen, setEdiSliderModalOpen] = useState(false); 
  const [selectedSlider, setSelectedSlider] = useState({}); 

  // Get all slider
  const { data: sliderRes, isLoading } = useGetAllSlidersQuery({}); 
  const sliders = sliderRes?.data?.data || [];               
 
  // Delete Slider
  const [deleteSlider] = useDeleteSliderMutation();
  const handleDeleteSlider = async (id) => { 
    try {
          await deleteSlider(id).unwrap();
          successToast("Slider deleted successfully!");
        } catch (error) {
          errorToast(error?.message || error?.data?.message);
        }
  }; 

  // Edit slider
    const [editSlider, { isLoading:isEditLoading }] = useEditSliderMutation(); 
  const handleEditSlider = async (data) => {
  const formData = new FormData();

    if (data.image) {
      const image = data.image[0].originFileObj; 

      formData.append("image", image);
    } 
    try {
      await editSlider({ id: selectedSlider?._id, data:formData }).unwrap();
      successToast("Slider updated successfully!");
      setEdiSliderModalOpen(false);
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
        onClick={() => setAddSliderModalOpen(true)}
        className="!w-full !py-6"
      >
        Add Slider
      </Button>
              <section className="mt-6 space-y-6">
                <div className="flex-center-between mb-4 px-1">
                  <h3 className="mb-4 text-2xl font-semibold text-white">
                    Sliders List
                  </h3>
      
                  {/* <Input
                    placeholder="Search by product name"
                    prefix={<Search className="mr-2 text-muted" size={18} />}
                    className="h-10 !w-1/2 !rounded-lg !border !text-base lg:!w-1/3 2xl:!w-1/4"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  /> */}
                </div>
 

       {isLoading ? (
              <PageLoader />
            ) :   sliders?.length > 0 ? (
      
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {sliders?.map((slider) => (
                  <SliderCard slider={slider}
                   key={slider?._id}  
                   setEdiSliderModalOpen={setEdiSliderModalOpen} 
                   handleDelete={handleDeleteSlider} 
                   setSelectedSlider={setSelectedSlider}/>
                  ))}
                </div>
            ) : (
              <EmptyContainer />
            )}
              </section>
      
            {/* Pagination */}
            {/* <div className="ml-auto mt-6 w-max">
              <Pagination
                pageSize={limit}
                current={page}
                showSizeChanger
                pageSizeOptions={["5",'10', '20', '50', '100']}
                onChange={(page, pageSize) => (setPage(page), setLimit(pageSize))}
                total={categoryMeta?.total}
                
              />
            </div> */}

 

      <AddSliderModal
        open={addSliderModalOpen}
        setOpen={setAddSliderModalOpen}
      />

      <EditCategoryModal
        open={editSliderModalOpen}
        handleEdit={handleEditSlider}
        setOpen={setEdiSliderModalOpen}
        selectedData={selectedSlider}
        isLoading={isEditLoading}

      />
    </ConfigProvider>
  );
}
