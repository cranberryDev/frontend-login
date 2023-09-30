import Card from "./Cards";
import { Tabs } from 'antd';
import dayjs from 'dayjs';
import { Input, DatePicker, Table, Button, Tooltip, Modal, Pagination } from 'antd';
import { SecurityCheckInSVG, SecurityCheckInSVG1, SecurityCheckInSVG2 } from "./icon"
import TabularBox from "./TabularBox";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import axiosAPI from "../../utils/axios";
import { notification } from 'antd';
import {
    ExclamationCircleFilled, CheckCircleOutlined
} from '@ant-design/icons';
import Navbar from '../Navbar';
import LoadingAnimation from "../Common/LoadingAnimation/LoadingAnimation";
import './style.css'
import Carrd from "./Carrds";
import Header from './header';

const tabList = ['all', 'pending', 'approved', 'rejected']

const SecurityCheckIn = () => {
    const { Search } = Input;
    const navigate = useNavigate();
    const [isLoader, setIsLoader] = useState(false);
    const [recordDetails, setRecordDetails] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectTab, setSelectTab] = useState('0');
    const [meetingCount,setMeetingCount] = useState({});
    const [visitordata, setVisitorData] = useState([]);
    const [filter, setFilter] = useState({
        searchValue: '',
        searchDate: dayjs(new Date()).format('YYYY-MM-DD'),
        current: 1, 
        pageSize: 2, 
        total: 0
    })

    // useEffect(() => {
    //     document.body.classList.add('dashboard-page');
    //     if (!sessionStorage.getItem('userType')) {
    //         navigate('/')
    //     }
    //     return () => document.body.classList.remove('dashboard-page');
    // }, [])

    useEffect(() => {
        fetchVisitorData();
    }, [filter.current, filter.searchValue, filter.searchDate, filter.total, selectTab ]);

    console.log(filter, 'filter')


    const fetchVisitorData = async () => {
        try {
            setIsLoader(true);
            const dataFilter = {}
            if(filter.searchValue){
                dataFilter.name= filter.searchValue;
            }
            if(filter.searchDate){
                dataFilter.date= filter.searchDate;
            }
            dataFilter.page =  filter.current;
            dataFilter.limit =  filter.pageSize;
            dataFilter.meetingStatus = tabList[parseInt(selectTab)];
            const updatedData = await axiosAPI.get(`/security-api/history_search_bar`,{
                params:dataFilter
            });
            setMeetingCount(updatedData?.data?.meetingCount)
            setVisitorData(updatedData.data.data);
            setFilter({...filter, total: updatedData?.data?.meetingCount[`${tabList[selectTab]}Count`]} )
            setIsLoader(false);
        }
        catch (err) {
            setIsLoader(false);
            console.log(err);
        }
    }


    const handleAction = async (e,record, action) => {
        
        e.stopPropagation()
        e.preventDefault()
        try{

            let res = await axiosAPI.put("/security-api/security_approval", {
                vm_request_id: record.vm_request_id,
                status: action
            });
            console.log(res);
            if (res.data.success) {
                setIsModalOpen(false);
                if (action === 'approved') {
                    setSelectTab('2')
                } else {
                    setSelectTab('3')
                }
                
                fetchVisitorData()
                notification.open({
                    message: res.data.message,
                    description: '',
                    icon: <CheckCircleOutlined style={{ color: '#00cc00' }} />,
                    
                });
            }
        }
        catch(err){
            console.log(err);
        }
    }

    const handleCheckIn = async (e, record) => {
        e.stopPropagation()
        e.preventDefault()

        try {
            console.log(record,'record');
            let res = await axiosAPI.put("/security-api/checkin", {
                vm_request_id: record.vm_request_id,
                check_in: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                visitor_id : record.visitor_id
            });
            console.log(res);
            if (res.data.success) {
                fetchVisitorData();
                setIsModalOpen(false);
                notification.open({
                    message: res.data.message,
                    description: '',
                    icon: <CheckCircleOutlined style={{ color: '#00cc00' }} />,
                });
            }
            else {
                notification.open({
                    message: res.data.message,
                    description: '',
                    icon: <ExclamationCircleFilled style={{ color: '#FF0000' }} />,

                });
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    const handleModal = async(record) => {
        const fetchImage = await axiosAPI.get("security-api/fetch_image",{
            params:{
                visitorId:record?.visitor_id
            }
        });
        record.id_proof = fetchImage?.data?.data?.id_proof;
        setRecordDetails(record)
        setIsModalOpen(true)
    }
    const handleCancel = () => {
        setIsModalOpen(false);
      };

    const handleCheckOut = async (e,record) => {
        e.stopPropagation()
        e.preventDefault()
        try{
            setIsLoader(true);
            let res = await axiosAPI.put("/security-api/checkout", {
                vm_request_id: record.vm_request_id,
                check_out: dayjs().format('YYYY-MM-DD HH:mm:ss')
            });
            console.log(res);
            if (res.data.success) {
                fetchVisitorData()
                setIsLoader(false);
                setIsModalOpen(false);
                notification.open({
                    message: res.data.message,
                    description: '',
                    icon: <CheckCircleOutlined style={{ color: '#00cc00' }} />,
    
                });
               
            }
            else {
                setIsLoader(false);
                notification.open({
                    message: res.data.message,
                    description: '',
                    icon: <ExclamationCircleFilled style={{ color: '#FF0000' }} />,
                });
            }
        }
        catch(err) {
            setIsLoader(false);
            console.log(err);
        }

    }

    const handlePageChange = (page) => {
        console.log(page);
        setFilter({...filter, current: page});
      };

    const columns = [
        {
            title: 'Visitor name',
            dataIndex: '',
            columnWidth: '30%',
            key: 'visitorName',
            render: (record) => {
                return <TabularBox className="info-section" title={'Visitor name'} name={record.visitor_name} avatarName={record.visitor_name} />
            }
        },
        {
            title: 'Visitor contact no',
            dataIndex: '',
            columnWidth: '30%',
            key: 'visitorContactNo',
            render: (record) => {
                return <TabularBox className="info-section" title={'Visitor contact no'} name={record?.visitor_mobile} />
            }
        },
        {
            title: 'Wants to meet',
            dataIndex: '',
            columnWidth: '30%',
            key: 'wantsToMeet',
            render: (record) => {
                return <TabularBox className="info-section" title={'Wants to meet'} name={record.host_employee} />
            }
        },
        {
            title: 'Action',
            dataIndex: '',
            width: '250',
            key: 'action',
            render: (record) => {
                return record.status.toLowerCase() === 'pending' ? <div className="action-btn">
                    <Button type="primary" danger onClick={(e) => handleAction(e,record, "rejected")}>
                        REJECT
                    </Button>
                    <Button type="primary" style={{ backgroundColor: "#099A4F" }} onClick={(e) => handleAction(e,record, "approved")}>
                        APPROVE
                    </Button>
                </div> : record.status.toLowerCase() === 'approved' ? 

                <div className="action-btn">
                    <Tooltip placement="top" title={record.check_in? `Checked In at ${record.check_in}`:""} overlayInnerStyle={{textAlign: 'center'}}> 
                    <Button type="primary" className="green-btn" disabled={record.check_in} onClick={(e) => handleCheckIn(e, record)}>
                    CHECK IN
                    </Button>
                    </Tooltip>
                <Tooltip placement="bottom" title={record.check_out? `Checked out at ${record.check_out}`:""}  overlayInnerStyle={{textAlign: 'center'}}>
                <Button type="primary" className="red-btn" disabled={record.check_out} onClick={(e) => handleCheckOut(e,record)}>
                        CHECK OUT

                    </Button>
                </Tooltip>
                    </div> :
                    <Tooltip placement="top" title={"Request is rejected"}>
                    <div className="action-btn">
                        <Button type="primary" danger disabled={true}>
                            {record.status.toUpperCase()}
                        </Button>
                    </div>
                    </Tooltip>
            }
        },
    ]

    const items = [
        {
            key: '0',
            label: "All Requests" + `(${meetingCount?.allCount})`,
            children: <>
            <Table 
            onRow={(record, rowIndex) => {
                return {
                  onClick: (event) => { handleModal(record)}, // click row
                };
              }} className="security-table" dataSource={visitordata} 
              columns={columns}
              pagination={false}
              />
              <Pagination 
              defaultCurrent={filter.current}
                pageSize={filter.pageSize} 
                onChange={handlePageChange} 
                total={filter.total} 
                />
              
            </>,   
        },
        {
            key: '1',
            label: "Pending Requests" + `(${meetingCount?.pendingCount})` ,
            children: <>
            <Table onRow={(record, rowIndex) => {
                return {
                  onClick: (event) => { handleModal(record)}, // click row
                };
              }} className="security-table" dataSource={visitordata} columns={columns} 
              pagination={false} />
             <Pagination 
              defaultCurrent={filter.current}
                pageSize={filter.pageSize} 
                onChange={handlePageChange} 
                total={filter.total} 
                />
            </>,
        },
        {
            key: '2',
            label: "Approved Requests" + `(${meetingCount?.approvedCount})`,
            children: <><Table onRow={(record, rowIndex) => {
                return {
                  onClick: (event) => { handleModal(record)}, // click row
                };
              }} className="security-table" dataSource={visitordata} columns={columns} pagination={false} />
            <Pagination 
              defaultCurrent={filter.current}
                pageSize={filter.pageSize} 
                onChange={handlePageChange} 
                total={filter.total} 
                />
              </>,
        },
        {
            key: '3',
            label: "Rejected Requests" + `(${meetingCount?.rejectedCount})`,
            children: <><Table onRow={(record, rowIndex) => {
                return {
                  onClick: (event) => { handleModal(record)}, // click row
                };
              }} className="security-table" dataSource={visitordata} columns={columns} pagination={false} />
                <Pagination 
              defaultCurrent={filter.current}
                pageSize={filter.pageSize} 
                onChange={handlePageChange} 
                total={filter.total} 
                />
              </>,
        },
    ];

    const handleSearch = async (name, value) => {
        //console.log(value, 'value')
        console.log(name, value)
        // const updateFilter = { ...filter };
        // console.log(name, value, 'AAAAAA')
        if (name === 'search') {
            // updateFilter.searchValue = value;
            setFilter({...filter, searchValue : value})
     
        } else if (name === 'date') {
            setFilter({...filter, searchDate : dayjs(value).format('YYYY-MM-DD')})
        }
        
        
    }

    if (isLoader) return <LoadingAnimation />;

    return (
        <div className="security-wrapper">
            <div className="security-table">
              <Header />
                <div className="header">
                    <h5>Security Approval Requests</h5>
                    <div className="right-column">
                        <Search
                            className="search-bar"
                            placeholder="Search visitor name..."
                            name="search"
                            defaultValue={filter.searchValue}
                            onSearch={(value) => handleSearch('search', value)}
                        />
                        <DatePicker defaultValue={dayjs(new Date())} allowClear={false} format={'YYYY/MM/DD'} className="date" data-testid="on-change" onChange={(value) => handleSearch('date', value)} />
                    </div>
                </div>
                <div className="security-tab">
                    <Tabs 
                    activeKey={selectTab} 
                    items={items} 
                    onChange={(activeKey) => {
                        setFilter({...filter, current: 1})
                        setSelectTab(activeKey)
                        }} />
                </div>
            </div>
            <Modal footer={null} title="" open={isModalOpen} onCancel={handleCancel} className="detail-modal">
                <Carrd data={recordDetails} handleCheckIn={handleCheckIn} handleCheckOut={handleCheckOut}  handleAction={handleAction}/>
            </Modal>
        </div>
    )
}

export default SecurityCheckIn;
