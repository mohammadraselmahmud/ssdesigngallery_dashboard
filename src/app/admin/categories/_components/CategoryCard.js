import CustomConfirm from "@/components/CustomConfirm/CustomConfirm"; 
import { Button, Flex } from "antd";
import Image from "next/image";
import React from "react";

export default function CategoryCard({ category, setEditCategoryModalOpen , handleDelete, setSelectedCategory}) {
 
  return (
    <div className="flex flex-col items-center gap-y-4 rounded-lg bg-white p-5">
   {  category?.categoryImage?<Image
        src={category?.categoryImage}
        alt={"Category banner of " + category?.name}
        height={1200}
        width={1200}
        className="h-[150px] w-auto rounded-lg"
      />
      :<div className="h-[150px] w-auto rounded-lg" />
}
      <h3 className="text-2xl font-bold">{category?.name}</h3>

      <Flex gap={10}>
        <CustomConfirm
          description={"Are you sure you want to delete the category?"}
          onConfirm={()=>handleDelete(category?._id)}
        >
          <Button
            type="default"
            className="!bg-danger !text-white"
            size="large"
          >
            Delete
          </Button>
        </CustomConfirm>

        <Button
          type="primary"
          size="large"
          onClick={() =>( setEditCategoryModalOpen(true), setSelectedCategory(category))}
          className="!w-[80px]"
        >
          Edit
        </Button>
      </Flex>
    </div>
  );
}
