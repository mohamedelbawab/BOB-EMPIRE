// Enhanced server.js with WebSocket support for real-time sync
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const http = require("http");
const WebSocket = require("ws");
const { getAIResponse, runSuperAI } = require("./ai");
const { supabaseAuthRouter } = require("./auth");
const { productsRouter } = require("./products");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store connected devices for real-time sync
const connectedDevices = new Map();

// Middleware
app.use(cors()); // Enable CORS for frontend
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve static files

// WebSocket handling for real-time sync between mobile and desktop
wss.on('connection', (ws, req) => {
    console.log('🔗 New WebSocket connection established');
    
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message.toString());
            handleWebSocketMessage(ws, data);
        } catch (error) {
            console.error('❌ Error parsing WebSocket message:', error);
        }
    });
    
    ws.on('close', () => {
        // Remove device from connected devices
        for (const [deviceId, device] of connectedDevices.entries()) {
            if (device.ws === ws) {
                connectedDevices.delete(deviceId);
                console.log(`📱 Device ${deviceId} disconnected`);
                break;
            }
        }
    });
    
    ws.on('error', (error) => {
        console.error('❌ WebSocket error:', error);
    });
});

function handleWebSocketMessage(ws, data) {
    switch (data.type) {
        case 'register':
            registerDevice(ws, data);
            break;
        case 'sync_data':
            syncDataToDevices(data);
            break;
        case 'chat_message':
            broadcastChatMessage(data);
            break;
        case 'run_agent':
            broadcastAgentUpdate(data);
            break;
        case 'link_device':
            linkDevices(data);
            break;
        case 'ping':
            ws.send(JSON.stringify({ type: 'pong' }));
            break;
        default:
            console.log('Unknown message type:', data.type);
    }
}

function registerDevice(ws, data) {
    const deviceInfo = {
        id: data.deviceId,
        platform: data.platform,
        ws: ws,
        connectedAt: new Date(),
        lastPing: new Date()
    };
    
    connectedDevices.set(data.deviceId, deviceInfo);
    console.log(`📱 Device registered: ${data.deviceId} (${data.platform})`);
    
    // Send confirmation
    ws.send(JSON.stringify({
        type: 'registered',
        deviceId: data.deviceId,
        connectedDevices: Array.from(connectedDevices.keys())
    }));
}

function syncDataToDevices(data) {
    const excludeDeviceId = data.deviceId;
    
    connectedDevices.forEach((device, deviceId) => {
        if (deviceId !== excludeDeviceId && device.ws.readyState === WebSocket.OPEN) {
            device.ws.send(JSON.stringify({
                type: 'sync_data',
                payload: data.payload,
                from: excludeDeviceId
            }));
        }
    });
}

function broadcastChatMessage(data) {
    const excludeDeviceId = data.deviceId;
    
    connectedDevices.forEach((device, deviceId) => {
        if (deviceId !== excludeDeviceId && device.ws.readyState === WebSocket.OPEN) {
            device.ws.send(JSON.stringify({
                type: 'chat_message',
                message: data.message,
                from: excludeDeviceId,
                timestamp: data.timestamp
            }));
        }
    });
}

function broadcastAgentUpdate(data) {
    connectedDevices.forEach((device, deviceId) => {
        if (device.ws.readyState === WebSocket.OPEN) {
            device.ws.send(JSON.stringify({
                type: 'agent_update',
                payload: {
                    agentId: data.agentId,
                    status: 'running',
                    task: data.input
                },
                from: data.deviceId
            }));
        }
    });
}

function linkDevices(data) {
    const device1 = connectedDevices.get(data.deviceId);
    const device2 = connectedDevices.get(data.targetDeviceId);
    
    if (device1 && device2) {
        // Notify both devices of successful linking
        device1.ws.send(JSON.stringify({
            type: 'device_linked',
            linkedDeviceId: data.targetDeviceId
        }));
        
        device2.ws.send(JSON.stringify({
            type: 'device_linked',
            linkedDeviceId: data.deviceId
        }));
        
        console.log(`🔗 Devices linked: ${data.deviceId} <-> ${data.targetDeviceId}`);
    }
}

// Routers
app.use("/api/auth", supabaseAuthRouter);
app.use("/api/products", productsRouter);

// AI endpoint
app.post("/api/ai", async (req, res) => {
  try {
    const { message } = req.body;
    const reply = await getAIResponse(message || "");
    res.json({ reply });
  } catch (error) {
    console.error("AI API Error:", error);
    res.status(500).json({ error: "AI service temporarily unavailable" });
  }
});

// Super AI endpoint for advanced commands
app.post("/api/super-ai", async (req, res) => {
  try {
    const { command } = req.body;
    const reply = await runSuperAI(command || "");
    res.json({ reply });
  } catch (error) {
    console.error("Super AI Error:", error);
    res.status(500).json({ error: "Super AI service temporarily unavailable" });
  }
});

// Enhanced agents endpoint for mobile/desktop apps
app.get("/api/agents", (req, res) => {
    const agents = [
        {
            id: '1',
            name: 'وكيل التسويق الذكي',
            role: 'marketing',
            status: 'idle',
            description: 'متخصص في التسويق الرقمي وإدارة الحملات'
        },
        {
            id: '2',
            name: 'وكيل خدمة العملاء',
            role: 'customer_service', 
            status: 'idle',
            description: 'يتعامل مع استفسارات العملاء والدعم الفني'
        },
        {
            id: '3',
            name: 'وكيل إدارة المخزون',
            role: 'inventory',
            status: 'idle',
            description: 'يدير المخزون والطلبات والشحن'
        },
        {
            id: '4',
            name: 'وكيل التحليل المالي',
            role: 'analytics',
            status: 'idle',
            description: 'يحلل البيانات المالية والمبيعات'
        }
    ];
    
    res.json({ agents });
});

// Run agent endpoint
app.post("/api/agents/run", (req, res) => {
    const { agentId, input } = req.body;
    
    // Simulate agent execution
    setTimeout(() => {
        // Broadcast agent completion to all connected devices
        connectedDevices.forEach((device) => {
            if (device.ws.readyState === WebSocket.OPEN) {
                device.ws.send(JSON.stringify({
                    type: 'agent_update',
                    payload: {
                        agentId: agentId,
                        status: 'completed',
                        result: `تم تنفيذ المهمة: ${input}`
                    }
                }));
            }
        });
    }, 2000);
    
    res.json({ 
        response: `تم تشغيل الوكيل ${agentId} بالمهمة: ${input}`,
        agentId,
        status: 'running'
    });
});

// Dashboard endpoint
app.get("/api/dashboard", (req, res) => {
    res.json({
        orders: 12,
        revenue: 3500,
        activeAgents: 140,
        connectedDevices: connectedDevices.size,
        platforms: 35
    });
});

// Health check endpoint
app.get("/api/ping", (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        connectedDevices: connectedDevices.size
    });
});

// Serve index.html for root path
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Bob Empire Server running on http://localhost:${PORT}`);
  console.log(`📱 WebSocket server ready for device connections`);
  console.log(`🌐 Mobile & Desktop apps can now sync in real-time`);
});