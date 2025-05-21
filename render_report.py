
import json
import os
import matplotlib.pyplot as plt
import networkx as nx
from html import escape

def safe_escape(val):
    return escape(str(val)) if val is not None else "N/A"

output_dir = "/tmp"

# Load data
with open(os.path.join(output_dir, "data.json"), "r", encoding="utf-8") as f:
    data = json.load(f)

# Sentiment Chart
sentiment_path = os.path.join(output_dir, "sentiment_pie_chart.png")
labels = list(data.get("sentiment_overview", {}).keys())
sizes = list(data.get("sentiment_overview", {}).values())
colors = ['#4CAF50', '#FFC107', '#F44336']
fig, ax = plt.subplots()
ax.pie(sizes, labels=labels, autopct='%1.1f%%', startangle=140, colors=colors)
ax.axis('equal')
plt.title('Sentiment Overview')
plt.savefig(sentiment_path, bbox_inches='tight')
plt.close()

# Network Graph
network_path = os.path.join(output_dir, "network_graph.png")
G = nx.Graph()
for cluster in data.get("network_analysis", {}).get("clusters", []):
    nodes = cluster["nodes"]
    for i in range(len(nodes)):
        G.add_node(nodes[i])
        for j in range(i + 1, len(nodes)):
            G.add_edge(nodes[i], nodes[j])
plt.figure(figsize=(8, 6))
pos = nx.spring_layout(G, seed=42)
node_colors = ['lightblue' if 'Trump' in node else 'salmon' for node in G.nodes()]
nx.draw(G, pos, with_labels=True, node_color=node_colors, edge_color='gray', node_size=1200, font_size=8)
plt.title("Network Influence Graph")
plt.savefig(network_path, bbox_inches='tight')
plt.close()

# Helper formatters
def bullet_list(items):
    return "\n".join(f"<li>{escape(item)}<\/li>" for item in items)

def user_blocks(users):
    return "\n".join(f"<p><strong>{escape(u['username'])} ({u['type']}):</strong> {escape(u['activity_summary'])}</p>" for u in users)

def cluster_blocks(clusters):
    return "\n".join(f"<p><strong>{escape(c['label'])}:</strong> {escape(c['summary'])}</p>" for c in clusters)

# Load HTML template
with open("osint_dark_template.html", "r", encoding="utf-8") as tpl:
    template = tpl.read()

# Fill content
html_filled = template.format(
    summary=safe_escape(data.get("summary")),
    topics=", ".join(escape(t) for t in data.get("top_topics", [])),
    users=user_blocks(data.get("notable_users", [])),
    clusters=cluster_blocks(data.get("network_analysis", {}).get("clusters", [])),
    positive=data.get("sentiment_overview", {}).get("positive", 0),
    neutral=data.get("sentiment_overview", {}).get("neutral", 0),
    negative=data.get("sentiment_overview", {}).get("negative", 0),
    flags=bullet_list(data.get("risk_flags", [])),
    start=safe_escape(data.get("timestamp_range", {}).get("from")),
    end=safe_escape(data.get("timestamp_range", {}).get("to"))
)

# Save HTML
with open(os.path.join(output_dir, "OSINT_Report.html"), "w", encoding="utf-8") as f:
    f.write(html_filled)
