// components/sampleData.ts
export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

export const data: TreeNode[] = [
  {
    id: '1',
    label: '1',
    children: [
      {
        id: '1.1',
        label: '1.1',
        children: [
          { id: '1.1.1', label: '1.1.1' },
          { id: '1.1.2', label: '1.1.2' },
        ],
      },
      {
        id: '1.2',
        label: '1.2',
        children: [
          { id: '1.2.1', label: '1.2.1' },
          { id: '1.2.2', label: '1.2.2' },
        ],
      },
    ],
  },
  {
    id: '2',
    label: '2',
    children: [
      {
        id: '2.1',
        label: '2.1',
        children: [
          { id: '2.1.1', label: '2.1.1' },
          { id: '2.1.2', label: '2.1.2' },
        ],
      },
      {
        id: '2.2',
        label: '2.2',
        children: [
          { id: '2.2.1', label: '2.2.1' },
          { id: '2.2.2', label: '2.2.2' },
        ],
      },
    ],
  },
];
