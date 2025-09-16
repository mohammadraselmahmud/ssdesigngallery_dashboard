import CustomTooltip from "@/components/CustomTooltip/CustomTooltip"; 
import textTruncate from "@/utils/textTruncate";
import { Image } from "antd";
import { Button } from "antd"; 
import { Trash2 } from "lucide-react";
import { Edit } from "lucide-react"; 
import { priceFormat } from "@/utils/priceFormate";

export default function ProductCard({
  product,
  setShowProductModal,
  setSelectedProduct,
  handleDeleteProduct,isDeleting
}) {
 
  return (
    <div className="flex flex-col justify-between gap-y-8 rounded-xl border border-white/75 p-4">
      <div className="space-y-5">
        <div className="flex-center-start gap-x-3">
          <Image
            src={product?.productImage}
            alt={product?.productName
}
            height={100}
            width={100}
            className="rounded-lg"
          />

          <div className="space-y-1 font-medium text-white">
            <h4 className="text-lg">{textTruncate(product?.productName, 80)}</h4>
            <p className="text-lg text-white/80">{priceFormat(product?.productPrice ?? 0)}</p>
          </div>
        </div>

        <div className="space-y-1 text-white">
          <h4 className="text-lg font-medium">Description</h4>
         

        <div className="rounded-xl border border-primary-white p-3 text-white flex gap-2 items-center justify-start">
           {
            product?.productDescription?.length > 0 && product?.productDescription?.map((dsc)=><p key={dsc} className="px-3 py-2 rounded-full bg-primary">{dsc}</p>)
          } 
        </div>
        </div>
      </div>

      <div className="flex-center-between gap-x-4">
        <CustomTooltip title="Edit Product" className="w-max">


        <Button
          size="large"
          type="primary"
          className="w-full rounded-xl"
          icon={<Edit size={16} />}
          iconPosition="end"
          onClick={() => (setShowProductModal(true),
              setSelectedProduct(product))}
        >
          Edit  
        </Button>
        </CustomTooltip> 

        <CustomTooltip title="Delete Product" className="w-max">
          <Button
            className="aspect-square !rounded-full !border-none !bg-danger !text-white"
            icon={<Trash2 size={16} />}
            size="large"
            disabled={isDeleting}
            onClick={()=>handleDeleteProduct(product?._id)}
            loading={isDeleting}
          />
        </CustomTooltip>
      </div> 
    </div>
  );
}
