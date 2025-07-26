import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { COLORS } from '../../utils/colors'

interface Node {
  id: number
  x: number
  y: number
  connections: number[]
}

interface NetworkVisualizationProps {
  className?: string
  nodeCount?: number
  animated?: boolean
}

const NetworkVisualization = ({ 
  className = '', 
  nodeCount = 12,
  animated = true 
}: NetworkVisualizationProps) => {
  const [nodes, setNodes] = useState<Node[]>([])

  useEffect(() => {
    const newNodes: Node[] = Array.from({ length: nodeCount }, (_, i) => {
      const angle = (i / nodeCount) * 2 * Math.PI
      const radius = 35 + Math.random() * 10
      return {
        id: i,
        x: 50 + Math.cos(angle) * radius,
        y: 50 + Math.sin(angle) * radius,
        connections: [],
      }
    })

    // Create connections between nodes
    newNodes.forEach((node, i) => {
      const connectionCount = Math.floor(Math.random() * 3) + 1
      for (let j = 0; j < connectionCount; j++) {
        const targetIndex = Math.floor(Math.random() * nodeCount)
        if (targetIndex !== i && !node.connections.includes(targetIndex)) {
          node.connections.push(targetIndex)
        }
      }
    })

    setNodes(newNodes)
  }, [nodeCount])

  return (
    <div className={`relative w-full h-full ${className}`}>
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Connections */}
        {nodes.map((node) =>
          node.connections.map((connectionId) => {
            const targetNode = nodes[connectionId]
            if (!targetNode) return null
            
            return (
              <motion.line
                key={`${node.id}-${connectionId}`}
                x1={node.x}
                y1={node.y}
                x2={targetNode.x}
                y2={targetNode.y}
                stroke="url(#connectionGradient)"
                strokeWidth="0.2"
                opacity="0.6"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: animated ? 1 : 1 }}
                transition={{
                  duration: 2,
                  delay: Math.random() * 2,
                  repeat: animated ? Infinity : 0,
                  repeatType: "reverse",
                }}
              />
            )
          })
        )}

        {/* Nodes */}
        {nodes.map((node, index) => (
          <motion.g key={node.id}>
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="1"
              fill="url(#nodeGradient)"
              initial={{ scale: 0 }}
              animate={{ 
                scale: animated ? [1, 1.5, 1] : 1,
                opacity: animated ? [0.7, 1, 0.7] : 0.8
              }}
              transition={{
                duration: 3,
                delay: index * 0.1,
                repeat: animated ? Infinity : 0,
              }}
            />
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="2"
              fill="none"
              stroke="url(#nodeGradient)"
              strokeWidth="0.1"
              opacity="0.3"
              animate={animated ? {
                r: [2, 4, 2],
                opacity: [0.3, 0, 0.3],
              } : {}}
              transition={{
                duration: 2,
                delay: index * 0.1,
                repeat: animated ? Infinity : 0,
              }}
            />
          </motion.g>
        ))}

        <defs>
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={COLORS.CYBER_BLUE_HEX} />
            <stop offset="50%" stopColor={COLORS.CYBER_PURPLE_HEX} />
            <stop offset="100%" stopColor={COLORS.CYBER_GREEN_HEX} />
          </linearGradient>
          <radialGradient id="nodeGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={COLORS.CYBER_BLUE_HEX} />
            <stop offset="100%" stopColor={COLORS.CYBER_PURPLE_HEX} />
          </radialGradient>
        </defs>
      </svg>
    </div>
  )
}

export default NetworkVisualization
