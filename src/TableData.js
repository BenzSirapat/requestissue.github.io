import React, { useState } from "react";
import { Table, Card, Button, Modal, Input, message } from "antd";
import listsIssueData from "./listsIssue";

const TableData = () => {
  const [listsIssue, setListsIssue] = useState(listsIssueData);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [approvalReason, setApprovalReason] = useState("");
  const [actionType, setActionType] = useState(""); // "approve" หรือ "reject"
  const [viewResApprove, setViewResApprove] = useState(null); // ใช้เก็บ res_approve ที่ต้องการดู

  const handleApproveClick = (type) => {
    if (selectedRowKeys.length === 0) {
      message.warning("กรุณาเลือกรายการก่อน");
      return;
    }
    setActionType(type);
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    if (!approvalReason.trim()) {
      message.warning("กรุณากรอกเหตุผล");
      return;
    }

    setListsIssue((prev) =>
      prev.map((item) =>
        selectedRowKeys.includes(item.id)
          ? {
              ...item,
              res_approve: approvalReason,
              status: actionType === "approve" ? "อนุมัติแล้ว" : "ไม่อนุมัติ",
              flag: actionType === "approve" ? 1 : 2,
            }
          : item
      )
    );

    setIsModalVisible(false);
    setApprovalReason("");
    setSelectedRowKeys([]); // เคลียร์การเลือก
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setApprovalReason("");
  };

  const handleViewResApprove = (record) => {
    setViewResApprove(record.res_approve || "ไม่มีข้อมูล");
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  const columns = [
    {
      title: "ลำดับ",
      dataIndex: "id",
      key: "id",
      width: "80px",
    },
    {
      title: "รายการ",
      dataIndex: "issue",
      key: "issue",
      width: "250px",
    },
    {
      title: "เหตุผล",
      dataIndex: "reason",
      key: "reason",
      width: "250px",
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      width: "150px",
      render: (text, record) => {
        let color = "green";
        if (record.flag === 0) {
          color = "orange";
        } else if (record.flag === 1) {
          color = "green";
        } else if (record.flag === 2) {
          color = "red";
        }
        return <span style={{ color }}>{text}</span>;
      },
    },
    {
      title: "การดำเนินการ",
      key: "action",
      width: "150px",
      render: (_, record) => (
        <Button type="link" onClick={() => handleViewResApprove(record)}>
          ดูรายละเอียด
        </Button>
      ),
    },
  ];

  return (
    <Card
      width={"80%"}
      style={{ margin: "20px auto" }}
      title="รายการคำขอ"
      bordered={false}
    >
      <Button
        style={{ margin: "10px", backgroundColor: "green", color: "white" }}
        size="large"
        onClick={() => handleApproveClick("approve")}
      >
        อนุมัติ
      </Button>
      <Button
        style={{ margin: "10px", backgroundColor: "red", color: "white" }}
        size="large"
        onClick={() => handleApproveClick("reject")}
      >
        ไม่อนุมัติ
      </Button>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={listsIssue}
        pagination={false}
        rowKey="id"
      />

      {/* Modal สำหรับกรอกเหตุผล */}
      <Modal
        title={actionType === "approve" ? "กรอกเหตุผลการอนุมัติ" : "กรอกเหตุผลการไม่อนุมัติ"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={actionType === "approve" ? "อนุมัติ" : "ไม่อนุมัติ"}
        cancelText="ยกเลิก"
      >
        <Input.TextArea
          rows={4}
          placeholder="กรุณากรอกเหตุผล"
          value={approvalReason}
          onChange={(e) => setApprovalReason(e.target.value)}
        />
      </Modal>

      {/* Modal สำหรับดู res_approve */}
      <Modal
        title="รายละเอียดการอนุมัติ"
        open={!!viewResApprove}
        onOk={() => setViewResApprove(null)}
        onCancel={() => setViewResApprove(null)}
        footer
      >
        <p>{viewResApprove}</p>
      </Modal>
    </Card>
  );
};

export default TableData;
