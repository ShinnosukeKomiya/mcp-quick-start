// call-tool.ts
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { CallToolResultSchema } from "@modelcontextprotocol/sdk/types.js";

async function main() {
    const client = new Client(
        {
            name: "mcp-typescript test client",
            version: "0.1.0",
        },
        {
            capabilities: {
                sampling: {},
            },
        },
    );


    const clientTransport = new StdioClientTransport({
        command: "npx",
        args: ["-y", "@modelcontextprotocol/server-memory"],
    });

    console.log("Connected to server.");

    await client.connect(clientTransport);
    console.log("Initialized.");

    const uuid = "test_entity_" + Math.random().toString(36).substring(7);
    await client.request(
        {
            method: "tools/call",
            params: {
                name: "create_entities",
                arguments: {
                    entities: [{
                        "name": uuid,
                        "created_at": new Date().toISOString(),
                    }]
                },
            },
        },
        CallToolResultSchema,
    );

    const result = await client.request({
        method: "tools/call",
        params: {
            name: "read_graph",
            arguments: {},
        }
    }, CallToolResultSchema)
    console.log(result.content[0].text);

    await client.close();
    console.log("Closed.");
}

main();
