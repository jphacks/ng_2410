"use client";

import dagre from "@dagrejs/dagre";
import {
	ConnectionLineType,
	Panel,
	ReactFlow,
	addEdge,
	useEdgesState,
	useNodesState,
} from "@xyflow/react";
import React, { useCallback, useState } from "react";
import "@xyflow/react/dist/style.css";
import ConversationGraph from "../ConversationGraph";

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (nodes: any, edges: any, direction = "LR") => {
	const isHorizontal = direction === "LR";
	dagreGraph.setGraph({ rankdir: direction });

	nodes.forEach((node: any) => {
		dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
	});

	edges.forEach((edge: any) => {
		dagreGraph.setEdge(edge.source, edge.target);
	});

	dagre.layout(dagreGraph);

	console.log('otori');

	const newNodes = nodes.map((node: any) => {
		const nodeWithPosition = dagreGraph.node(node.id);
		const newNode = {
			...node,
			targetPosition: isHorizontal ? "left" : "top",
			sourcePosition: isHorizontal ? "right" : "bottom",
			// We are shifting the dagre node position (anchor=center center) to the top left
			// so it matches the React Flow node anchor point (top left).
			position: {
				x: nodeWithPosition.x - nodeWidth / 2,
				y: nodeWithPosition.y - nodeHeight / 2,
			},
			style:{border: "5px solid #FDF4E2",
				boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.4)",
			},
		};

		return newNode;
	});

	return { nodes: newNodes, edges };
};

// const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
// 	initialNodes,
// 	initialEdges,
// );

const ConversationHistoryFlow = ({
	messageNodes,
	messageEdges,
	analysisArray,
	dataArray,
}: { messageNodes: any[]; messageEdges: any[]; analysisArray: any[]; dataArray: any[];}) => {
	const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
		messageNodes,
		messageEdges,
	);
	const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

	const onConnect = useCallback(
		(params: any) =>
			setEdges((eds) =>
				addEdge(
					{ ...params, type: ConnectionLineType.SmoothStep, animated: true },
					eds,
				),
			),
		[],
	);
	console.log("っっp");
	console.log("チェえええ");

	const onNodeMouseEnter = (event, node) => {
		// ノードにカーソルが重なったときの処理
		console.log("Mouse entered node:", node);
		// node.style.background = "#FFF";
		setNodes((nds) =>
			nds.map((n) => {
				if (n.id === node.id) {
					return {
						...n, // ここで元のノードのプロパティを保持
						style: {
							...n.style, // 元のスタイルを保持しつつ
							backgroundColor: "#D9D9D9", // 新しい背景色を設定
						},
					};
				}
			return n; // 条件に合わないノードはそのまま返す
			})
		);
	};

	const onNodeMouseLeave = (event, node) => {
		// ノードにカーソルが重なったときの処理
		console.log("Mouse leaved node:", node);
		setNodes((nds) =>
			nds.map((n) => {
				if (n.id === node.id) {
					return {
						...n, // ここで元のノードのプロパティを保持
						style: {
							...n.style, // 元のスタイルを保持しつつ
							backgroundColor: "#F9F9F9", // 新しい背景色を設定
						},
					};
				}
			return n; // 条件に合わないノードはそのまま返す
			})
		);
	};

	const [popupContent, setPopupContent] = useState(null);
    const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

	const onNodeClick = (event, node) => {
		// ノードにカーソルが重なったときの処理
		console.log("node clicked:", node);
		setPopupContent(node.data.popupContent); // ノードのpopupContentをポップアップに表示
        // setPopupPosition({ x: node.position.x, y: node.position.y });
		setPopupPosition({ x: event.clientX, y: event.clientY });
		console.log("node clicked44:", node);
	}

	const closePopup = () => {
        setPopupContent(null);
    };

	const [showGraph, setShowGraph] = useState(false);
	const toggleGraph = () => {
        setShowGraph(prev => !prev); // 現在の状態を反転
    };

	return (
		<ReactFlow
			nodes={nodes}
			edges={edges}
			onNodesChange={onNodesChange}
			onEdgesChange={onEdgesChange}
			onConnect={onConnect}
			onNodeMouseEnter={onNodeMouseEnter}
			onNodeMouseLeave={onNodeMouseLeave}
			onNodeClick ={onNodeClick}
			connectionLineType={ConnectionLineType.SmoothStep}
			fitView
			style={{ backgroundColor: "#FDF4E2" }}
		>
		{popupContent && (
            <div
                // onClick={closePopup}
                style={{
					position: "absolute",
					top: popupPosition.y - 200,
					left: popupPosition.x - 100,
					backgroundColor: "#939498",
					padding: "10px",
					width: 300,
					borderRadius: "10px",
					zIndex: 1000,
				}}
            >
				<div style={{ textAlign: "right", color: "white", }}>
					<p><span style={{ fontWeight: "bold" }}>{typeof popupContent === "string" ? popupContent.split('::::')[1] : popupContent}</span>点 / 100</p>
				</div>
				<div style={{ textAlign: "left", color: "white", paddingBottom: 10}}>
					<p>Advice：</p>
					{/* <p>{popupContent.split(':')}</p> */}
					<p>{typeof popupContent === "string" ? popupContent.split('::::')[0] : popupContent}</p>
				</div>
				<div style={{ display: "flex", justifyContent: "space-between", width: "100%", color: "white", paddingBottom: 10}}>
					<button style={{ height: 40, color: "white", fontWeight: "bold", backgroundColor: "#F3AF97", borderRadius: "10px", }} >
						<span style={{margin:5}}>ここから始める</span>
					</button>
					<button onClick={closePopup}>閉じる</button>
				</div>
            </div>
		)}
		<div style={{width:"100%", backgroundColor: "#F3AF97", position: "absolute", top: 63, left: "50%", transform: "translateX(-50%)", zIndex: 100, padding: "20px"}}>
				<div style={{ display: "flex", justifyContent: "space-between", width: "100%",fontSize: "2em", fontWeight: "bold", }}>
					<p style={{ margin: 0 }}>総評！</p>
					<p style={{ margin: 0 }}>{analysisArray[1]}点 / 100</p>
				</div>
				<div style={{ textAlign: "left", maxHeight: "100px", overflowY: "auto" }}>
					<p style={{fontSize: "1em"}}>{analysisArray[0]}</p>
				</div>
		</div>

		{showGraph && (
			<div style={{borderRadius: "10px", zIndex: 10000, position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "#FFF",boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.4)",}}>
				<p style={{fontWeight: "bold", textAlign: "center", fontSize: "1.5em", margin: "10px"}}>会話点数分析グラフ</p>
				<div style={{margin: "10px"}}>
					<ConversationGraph 
						dataArray={dataArray}
					/>
				</div>
				<p></p>
			</div>
		)}
		<button style={{ height: 45, width:90, color: "white", fontWeight: "bold", fontSize: "1.2em", backgroundColor: "#7D8B95", borderRadius: "20px", position: "absolute", left: 30, bottom: 100, zIndex: 100 }} onClick={toggleGraph}>
			グラフ
		</button>
		</ReactFlow>
	);
};

export default ConversationHistoryFlow;
