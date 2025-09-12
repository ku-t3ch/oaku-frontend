import React, { useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { Project } from "@/interface/project";

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusProps = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return { text: "เสร็จสิ้น", bgClass: "bg-[#006C67]" };
    case "IN_PROGRESS":
      return { text: "ดำเนินการ", bgClass: "bg-blue-600" };
    case "PADDING":
      return { text: "ร่างโครงการ", bgClass: "bg-amber-500" };
    case "CANCELED":
      return { text: "ยกเลิก", bgClass: "bg-red-600" };
    default:
      return { text: status, bgClass: "bg-gray-400" };
  }
};

const columns = [
  { name: "ชื่อโครงการ", uid: "name" },
  { name: "ระยะเวลา", uid: "date" },
  { name: "สถานที่", uid: "location" },
  { name: "ผู้เข้าร่วม", uid: "participants" },
  { name: "สถานะ", uid: "status" },
];

interface ProjectTableProps {
  projects: Project[];
  loading?: boolean;
  onProjectClick?: (project: Project) => void;
}

export const ProjectTable: React.FC<ProjectTableProps> = ({
  projects,
  loading = false,
  onProjectClick,
}) => {
  const renderCell = useCallback((project: Project, columnKey: React.Key) => {
    const cellValue = project[columnKey as keyof Project];

    switch (columnKey) {
      case "name":
        return (
          <div>
            <p className="font-bold text-sm text-slate-600">{project.nameTh}</p>
          </div>
        );

      case "date":
        return (
          <div className="text-sm text-slate-600 flex justify-center">
            <p>
              {formatDate(project.dateStart)} - {formatDate(project.dateEnd)}
            </p>
          </div>
        );

      case "location":
        return (
          <div className="text-sm text-slate-700 flex justify-center">
            {project.location?.location || "-"}
          </div>
        );

      case "participants":
        return (
          <p className="text-sm text-slate-700 flex justify-center">{`${project.participants} คน`}</p>
        );

      case "status":
        const { text, bgClass } = getStatusProps(project.status);
        return (
          <div className="flex justify-center">
            <span
              className={`text-white text-xs font-medium px-3 py-1 rounded-full ${bgClass}`}
            >
              {text}
            </span>
          </div>
        );

      default:
        return String(cellValue);
    }
  }, []);

  return (
    <Table aria-label="Projects Table">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            className="bg-[#006C67] text-white font-semibold text-sm px-4 py-3 first:rounded-tl-xl last:rounded-tr-xl"
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={projects} isLoading={loading}>
        {(item) => (
          <TableRow
            key={item.id}
            className="even:bg-gray-50 hover:bg-gray-100 transition-colors"
            onClick={onProjectClick ? () => onProjectClick(item) : undefined}
          >
            {(columnKey) => (
              <TableCell className="px-4 py-3 text-sm text-gray-800 items-center justify-center">
                {renderCell(item, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
