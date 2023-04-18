import {
  Button,
  Checkbox,
  DatePicker,
  Input,
  InputNumber,
  Radio,
  Space,
} from "antd"
import { ColumnFilterItem, FilterDropdownProps } from "antd/es/table/interface"
import styles from "./index.module.scss"
import React, { FormEvent, useEffect, useState } from "react"
import { SearchOutlined } from "@ant-design/icons"
import { hasValue } from "@/utils/global"
import { parseNumVal, parseTimeVal } from "./columnsLib"
import { SP_TOKEN } from "@/utils/constant"

export const TimeFilter = ({
  setSelectedKeys,
  selectedKeys,
  confirm,
  clearFilters,
}: FilterDropdownProps) => (
  <div className={styles.customFilterDropdown}>
    <div className={styles.dropdownBody}>
      <div>
        <div>From</div>
        <Space>
          <DatePicker
            showTime={{ format: "HH:mm" }}
            format="YYYY-MM-DD HH:mm"
            allowClear
            value={parseTimeVal(selectedKeys, 0)}
            onChange={(e) => {
              e
                ? parseTimeVal(selectedKeys, 1)
                  ? setSelectedKeys([
                      `${e.format("YYYY-MM-DDTHH:mm:ss")}${SP_TOKEN}${
                        `${selectedKeys[0]}`.split(SP_TOKEN)[1]
                      }`,
                    ])
                  : setSelectedKeys([
                      `${e.format("YYYY-MM-DDTHH:mm:ss")}${SP_TOKEN}`,
                    ])
                : parseTimeVal(selectedKeys, 1)
                ? setSelectedKeys([
                    `${SP_TOKEN}${`${selectedKeys[0]}`.split(SP_TOKEN)[1]}`,
                  ])
                : setSelectedKeys([])
            }}
          />
        </Space>
      </div>
      <div>
        <div>To</div>
        <Space>
          <DatePicker
            showTime={{ format: "HH:mm" }}
            format="YYYY-MM-DD HH:mm"
            allowClear
            value={parseTimeVal(selectedKeys, 1)}
            onChange={(e) => {
              e
                ? parseTimeVal(selectedKeys, 0)
                  ? setSelectedKeys([
                      `${
                        `${selectedKeys[0]}`.split(SP_TOKEN)[0]
                      }${SP_TOKEN}${e.format("YYYY-MM-DDTHH:mm:ss")}`,
                    ])
                  : setSelectedKeys([
                      `${SP_TOKEN}${e.format("YYYY-MM-DDTHH:mm:ss")}`,
                    ])
                : parseTimeVal(selectedKeys, 0)
                ? setSelectedKeys([
                    `${`${selectedKeys[0]}`.split(SP_TOKEN)[0]}${SP_TOKEN}`,
                  ])
                : setSelectedKeys([])
            }}
          />
        </Space>
      </div>
    </div>
    <Space className={styles.filterBtn}>
      <Button
        size="small"
        type="link"
        disabled={!selectedKeys.length}
        onClick={() => {
          clearFilters?.()
          confirm()
        }}
      >
        Reset
      </Button>
      <Button type="primary" size="small" onClick={() => confirm()}>
        OK
      </Button>
    </Space>
  </div>
)

export const NumFilter = ({
  setSelectedKeys,
  selectedKeys,
  confirm,
  clearFilters,
}: FilterDropdownProps) => (
  <div className={styles.customFilterDropdown}>
    <div className={styles.dropdownBody}>
      <div>
        <Space>
          <InputNumber
            value={parseNumVal(selectedKeys, 0)}
            onChange={(e) => {
              hasValue(e)
                ? parseNumVal(selectedKeys, 1)
                  ? setSelectedKeys([
                      `${e}${SP_TOKEN}${
                        `${selectedKeys[0]}`.split(SP_TOKEN)[1]
                      }`,
                    ])
                  : setSelectedKeys([`${e}${SP_TOKEN}`])
                : parseNumVal(selectedKeys, 1)
                ? setSelectedKeys([
                    `${SP_TOKEN}${`${selectedKeys[0]}`.split(SP_TOKEN)[1]}`,
                  ])
                : setSelectedKeys([])
            }}
          />
        </Space>
      </div>
      <div>-</div>
      <div>
        <Space>
          <InputNumber
            value={parseNumVal(selectedKeys, 1)}
            onChange={(e) => {
              hasValue(e)
                ? parseNumVal(selectedKeys, 0)
                  ? setSelectedKeys([
                      `${
                        `${selectedKeys[0]}`.split(SP_TOKEN)[0]
                      }${SP_TOKEN}${e}`,
                    ])
                  : setSelectedKeys([`${SP_TOKEN}${e}`])
                : parseNumVal(selectedKeys, 0)
                ? setSelectedKeys([
                    `${`${selectedKeys[0]}`.split(SP_TOKEN)[0]}${SP_TOKEN}`,
                  ])
                : setSelectedKeys([])
            }}
          />
        </Space>
      </div>
    </div>
    <Space className={styles.filterBtn}>
      <Button
        size="small"
        type="link"
        disabled={!selectedKeys.length}
        onClick={() => {
          clearFilters?.()
          confirm()
        }}
      >
        Reset
      </Button>
      <Button type="primary" size="small" onClick={() => confirm()}>
        OK
      </Button>
    </Space>
  </div>
)
export const TagsFilter = ({
  selectedKeys,
  setSelectedKeys,
  confirm,
  clearFilters,
  filters,
}: FilterDropdownProps) => {
  const [items, setItems] = useState<ColumnFilterItem[] | undefined>(filters)
  const [joinType, setJoinType] = useState(
    selectedKeys[0]
      ? selectedKeys[0].toString().includes("^&")
        ? "^&"
        : "^|"
      : "^|",
  )

  useEffect(() => {
    setItems(() => filters)
  }, [filters])

  return (
    <div className={styles.customFilterDropdown}>
      <div className={styles.dropdownBody}>
        <Input
          placeholder="Search in filters"
          prefix={<SearchOutlined style={{ color: "#cacaca" }} />}
          onInput={(e: FormEvent<HTMLInputElement>) => {
            e.currentTarget.value
              ? setItems(
                  filters?.filter((f) =>
                    f.value.toString().includes(e.currentTarget.value),
                  ),
                )
              : setItems(filters)
          }}
        />
        <div className={styles.switch}>
          <Radio.Group
            value={joinType === "^&" ? "And" : "Any"}
            size="small"
            optionType="button"
            options={["Any", "And"]}
            onChange={(e) => {
              const oldType = joinType
              const newType = e.target.value === "And" ? "^&" : "^|"
              selectedKeys[0] &&
                setSelectedKeys([
                  selectedKeys[0].toString().replaceAll(oldType, newType),
                ])
              setJoinType(newType)
            }}
          />
        </div>
        <Checkbox.Group
          style={{ display: "block" }}
          value={selectedKeys[0]?.toString().split(joinType) ?? []}
          onChange={(e) =>
            setSelectedKeys(
              e.length ? [e.map((i) => i.toString()).join(joinType)] : [],
            )
          }
        >
          {items?.map((f) => (
            <li key={`tgs-${f.value}`}>
              <Checkbox value={f.value}>{f.text}</Checkbox>
            </li>
          ))}
        </Checkbox.Group>
      </div>
      <Space className={styles.filterBtn}>
        <Button
          size="small"
          type="link"
          disabled={!selectedKeys.length}
          onClick={() => {
            clearFilters?.()
            confirm()
          }}
        >
          Reset
        </Button>
        <Button type="primary" size="small" onClick={() => confirm()}>
          OK
        </Button>
      </Space>
    </div>
  )
}
