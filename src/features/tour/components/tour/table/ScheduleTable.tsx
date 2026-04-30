"use client";
import ScheduleDataTable from "./ScheduleDataTable";
import { getSchedules } from "@/features/tour/services/schedule.service";
import { columns } from "./ScheduleColumn";

const ScheduleTable = ({
  tourId,
  setValue,
  isView = false,
}: {
  tourId: string;
  setValue: any;
  isView: boolean;
}) => {
  const getSchedulesWithTourId = async ({
    page,
    size,
  }: {
    page: number;
    size: number;
  }) => {
    return getSchedules({
      tourId,
      page,
      size,
    });
  };

  return (
    <div className="mt-2">
      <ScheduleDataTable
        columns={columns}
        getData={getSchedulesWithTourId}
        setValue={setValue}
        isView={isView}
      />
    </div>
  );
};

export default ScheduleTable;
