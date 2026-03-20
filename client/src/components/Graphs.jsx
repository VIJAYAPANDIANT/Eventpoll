                        import { Bar } from "react-chartjs-2";
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import "../App.css";
import { useDispatch } from "react-redux";
import { endedPoll } from "../redux/data/action";
import { useNavigate } from "react-router-dom";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function Graphs(item) {
    const [data, setData] = useState([]);
    const [label, setLabel] = useState([]);
    const [qlabel, setQLabel] = useState([]);
    let token = localStorage.getItem("adminToken");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(endedPoll(token));
    }, [dispatch, token]);

    useEffect(() => {
        let label1 = [];
        let data1 = [];
        let qLabel1 = [];
        
        const questions = item.pollData[0]?.questions || [];
        const questionKeys = Object.keys(questions);
        
        for (let i = 0; i < questionKeys.length; i++) {
            const qKey = questionKeys[i];
            const questionObj = questions[qKey];
            qLabel1.push(questionObj.question);
            
            if (questionObj.type === "openended") {
                label1.push({ labels: [], type: "openended", responses: questionObj.responses || [] });
                data1.push({ data: [], optionId: [], type: "openended" });
            } else {
                let labels = [];
                let datas = [];
                let optionId = [];
                const optionKeys = Object.keys(questionObj.options || {});
                
                for (let j = 0; j < optionKeys.length; j++) {
                    const oKey = optionKeys[j];
                    const optObj = questionObj.options[oKey];
                    labels.push(optObj.option?.text || optObj.option || "Option");
                    optionId.push(oKey);
                    datas.push(optObj.votes || 0);
                }
                label1.push({ labels: labels, type: questionObj.type });
                data1.push({ data: datas, optionId: optionId, type: questionObj.type });
            }
        }
        setData(data1);
        setLabel(label1);
        setQLabel(qLabel1);
    }, [item.pollData]);
   
    const onClick = (event, clickedElements) => {
        if (clickedElements.length === 0) return;
        const { dataIndex } = clickedElements[0].element.$context;
        let oId =  data[0]?.optionId[dataIndex];
        localStorage.setItem("pollId", item?.pollData[0]?.pollId);
        localStorage.setItem("optionId", oId);
        localStorage.setItem("questionId", Object.keys(item.pollData[0]?.questions || {})[0]);
        if(!item?.pollData[0]?.pollStatus){
            navigate('/user-voted');
        }
    };

    return (
        <Box>
            {label.length > 0 &&
                label.map((l, i) => {
                    if (l.type === "openended") {
                        return (
                            <Box key={i} mb={10} p={6} bg="white" borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
                                <Heading size="md" mb={4} color="gray.700">{qlabel[i]}</Heading>
                                <Stack spacing={3}>
                                    {l.responses && Object.values(l.responses).length > 0 ? (
                                        Object.values(l.responses).map((res, resIdx) => (
                                            <Box key={resIdx} p={4} bg="blue.50" borderRadius="xl" border="1px solid" borderColor="blue.100">
                                                <Text fontWeight="700" color="blue.700" fontSize="sm">{res.fullName || "Anonymous"}</Text>
                                                <Text mt={1} color="gray.700">{res.text}</Text>
                                            </Box>
                                        ))
                                    ) : (
                                        <Text color="gray.400" fontStyle="italic">No responses yet.</Text>
                                    )}
                                </Stack>
                            </Box>
                        );
                    }
                    return (
                        <article className="canvas-container" key={i}>
                            <Bar
                                className="bar"
                                options={{
                                    indexAxis: "y",
                                    layout: {
                                        padding: 40,
                                    },
                                    elements: {
                                        bar: {
                                            borderWidth: 1,
                                        },
                                    },
                                    maintainAspectRatio: false,
                                    scales: {
                                        x: {
                                            grid: {
                                                display: false,
                                            },
                                        },
                                        y: {
                                            grid: {
                                                display: false,
                                            },
                                        },
                                    },
                                    plugins: {
                                        legend: {
                                            display: false,
                                            labels: {
                                                font: {
                                                    size: 20,
                                                },
                                            },
                                        },
                                        title: {
                                            display: true,
                                            text: qlabel[i],
                                        },
                                        datalabels: {
                                            color: "grey",
                                            formatter: (value) => value,
                                            anchor: "end",
                                            offset: -30,
                                            align: "start",
                                            links: "/user-vote",
                                        },
                                    },
                                    onClick,
                                }}
                                plugins={[ChartDataLabels]}
                                data={{
                                    labels: l.labels,
                                    datasets: [
                                        {
                                            label: qlabel[i],
                                            data: data[i].data,
                                            backgroundColor:
                                                "hsl(205.85635359116023, 95.76719576719576%, 37.05882352941177%)",
                                            maxBarThickness: 18,
                                            minBarLength: 2,
                                        },
                                    ],
                                }}
                                height={"200px"}
                            />
                        </article>
                    );
                })}
        </Box>
    );
}
