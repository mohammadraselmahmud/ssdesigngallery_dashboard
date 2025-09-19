'use client';

import React from 'react';
import { Card, Button, Tooltip } from 'antd';
import { Trash2, SquarePen } from 'lucide-react';

export default function SliderCard({
  slider,
  setEdiSliderModalOpen,
  handleDelete,
  setSelectedSlider,
}) {
  const onEdit = () => {
    setSelectedSlider(slider);
    setEdiSliderModalOpen(true);
  };

 

  return (
    <div className="group relative mx-4 my-4 w-[300px]">
      <Card
        hoverable
        className="
          overflow-hidden rounded-xl border-none shadow-lg
          transition-all duration-300 ease-in-out
           
          hover:shadow-2xl
          bg-gradient-to-br from-purple-100 to-blue-100
        "
        
        bodyStyle={{ display: 'none' }}
        cover={
          <div className="relative">
            {/* Image */}
            <img
              alt={slider?.title || 'Slider image'}
              src={slider?.sliderImage || '/placeholder.png'}
              className="h-[200px] w-full rounded-t-xl object-cover"
            />

            {/* Top-right floating actions */}
            <div
              className="pointer-events-none absolute right-2 top-2 flex gap-2
                opacity-0 transition-all duration-300 ease-out
                group-hover:opacity-100 group-hover:translate-y-0 translate-y-1"
            >
              {/* Gradient chip for readability */}
              <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-white/60 p-1 backdrop-blur-md shadow-sm">
                <Tooltip title="Edit">
                  <Button
                    aria-label="Edit slider"
                    type="default"
                    shape="circle"
                    className="!border-none !bg-blue-500 hover:!bg-blue-600 transition-transform duration-300 hover:rotate-6"
                    icon={<SquarePen size={16} color="#fff" />}
                    onClick={onEdit}
                  />
                </Tooltip>

                <Tooltip title="Delete">
                  <Button
                    aria-label="Delete slider"
                    type="default"
                    shape="circle"
                    className="!border-none !bg-red-500 hover:!bg-red-600 transition-transform duration-300 hover:-rotate-6"
                    icon={<Trash2 size={16} color="#fff" />}
                    onClick={()=>handleDelete(slider?._id)}
                    danger
                  />
                </Tooltip>
              </div>
            </div>

            {/* Subtle bottom gradient for future text (optional) */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent" />
          </div>
        }
      />
    </div>
  );
}
