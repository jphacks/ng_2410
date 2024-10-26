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
}: { messageNodes: any[]; messageEdges: any[] }) => {
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

	return (
		<ReactFlow
			nodes={nodes}
			edges={edges}
			onNodesChange={onNodesChange}
			onEdgesChange={onEdgesChange}
			onConnect={onConnect}
			onNodeMouseEnter={onNodeMouseEnter}
			onNodeMouseLeave={onNodeMouseLeave}
			connectionLineType={ConnectionLineType.SmoothStep}
			fitView
			style={{ backgroundColor: "#FDF4E2" }}
		>
			<div style={{width:"75%", backgroundColor: "#F3AF97", position: "absolute", top: 200, zIndex: 100}}>
				<p>総評！</p>
				<p>サンプルサンプルサンプル</p>
			</div>
			<button style={{ height: 45, width:150, color: "white", fontWeight: "bold", fontSize: "1.2em", backgroundColor: "#F3AF97", borderRadius: "10px", position: "absolute", right: 30, bottom: 50, zIndex: 100 }}>
				ホームへ戻る
			</button>
		</ReactFlow>
	);
};

export default ConversationHistoryFlow;
