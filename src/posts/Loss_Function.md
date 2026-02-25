---
title: "Hello World: My First Blog Post"
date: "2026-02-25"
category: "Technical"
tags: ["Machine Learning", "PyTorch"]
---

# PyTorch 损失函数全解：从数学原理到工程实践

在深度学习的浩瀚宇宙中，**损失函数（Loss Function）** 扮演着“北极星”的角色。它量化了模型预测与真实标签之间的差距，指引着优化器（Optimizer）在参数空间中寻找最优解。选择合适的损失函数，往往比调整网络结构更能决定模型的最终性能。

本文将深入剖析 PyTorch `torch.nn` 模块中内置的全部损失函数。我们将超越简单的 API 调用，深入其**数学本质**、**梯度特性**、**数值稳定性**以及**工程陷阱**。无论你是处理回归、分类、排序还是生成任务，本文都将为你提供详尽的指导。

---

## 目录

1.  [回归损失 (Regression Losses)](#1-回归损失-regression-losses)
    *   [L1Loss (MAE)](#11-nnl1loss)
    *   [MSELoss (L2)](#12-nnmseloss)
    *   [HuberLoss](#13-nnhuberloss)
    *   [SmoothL1Loss](#14-nnsmoothl1loss)
2.  [分类损失 (Classification Losses)](#2-分类损失-classification-losses)
    *   [NLLLoss](#21-nnnllloss)
    *   [CrossEntropyLoss](#22-nncrossentropyloss)
    *   [BCELoss](#23-nnbceloss)
    *   [BCEWithLogitsLoss](#24-nnbcewithlogitsloss)
    *   [SoftMarginLoss](#25-nnsoftmarginloss)
    *   [MultiLabelSoftMarginLoss](#26-nnmultilabelsoftmarginloss)
    *   [MultiLabelMarginLoss](#27-nnmultilabelmarginloss)
    *   [MultiMarginLoss](#28-nnmultimarginloss)
3.  [嵌入与排序损失 (Embedding & Ranking Losses)](#3-嵌入与排序损失-embedding--ranking-losses)
    *   [MarginRankingLoss](#31-nnmarginrankingloss)
    *   [HingeEmbeddingLoss](#32-nnhingeembeddingloss)
    *   [CosineEmbeddingLoss](#33-nncosineembeddingloss)
    *   [TripletMarginLoss](#34-nntripletmarginloss)
4.  [分布散度与序列损失 (Distribution & Sequence Losses)](#4-分布散度与序列损失-distribution--sequence-losses)
    *   [KLDivLoss](#41-nnkldivloss)
    *   [CTCLoss](#42-nnctcloss)
    *   [PoissonNLLLoss](#43-nnpoissonnllloss)
    *   [GaussianNLLLoss](#44-nngaussiannllloss)
5.  [总结与速查表](#5-总结与速查表)
6.  [参考文献](#6-参考文献)

---

## 1. 回归损失 (Regression Losses)

回归任务的目标是预测连续数值。

### 1.1 `nn.L1Loss`

**全称**：Mean Absolute Error (MAE)

#### 1.1.1 数学定义
对于输入 $x$ 和目标 $y$，包含 $N$ 个样本：

$$
\ell(x, y) = L = \{l_1, \dots, l_N\}^\top, \quad l_n = |x_n - y_n|
$$

若 `reduction='mean'`（默认）：
$$
\ell(x, y) = \text{mean}(L)
$$

#### 1.1.2 函数特征
*   **梯度特性**：梯度在非零处恒为 $\pm 1$（或缩放因子），在 $0$ 处不可导（通常次梯度设为 0）。
*   **鲁棒性**：对异常值（Outliers）**非常鲁棒**。因为误差增大时，梯度不会像 MSE 那样呈二次方增长。
*   **稀疏性**：倾向于产生稀疏解（某些维度误差完全为 0）。

#### 1.1.3 适用场景
*   回归任务中存在较多异常值。
*   图像生成任务（如 GAN 中的重构损失），L1 比 L2 产生的图像更清晰（L2 倾向于模糊平均）。

#### 1.1.4 注意事项
*   **收敛性**：由于梯度恒定，在接近最优解时（误差很小），梯度依然很大，可能导致模型在最优解附近震荡。通常配合学习率衰减（Learning Rate Decay）使用。

#### 1.1.5 完整示例
```python
import torch
import torch.nn as nn

# 1. 数据构造
# 预测值 (Batch=2, Dim=3)
input_tensor = torch.tensor([[1.0, 2.0, 3.0], [4.0, 5.0, 6.0]], requires_grad=True)
# 真实值
target_tensor = torch.tensor([[1.5, 2.0, 4.5], [3.0, 5.0, 8.0]])

# 2. 定义损失函数
# reduction='mean' (默认): 返回标量，所有元素误差的平均值
criterion = nn.L1Loss(reduction='mean')

# 3. 前向计算
loss = criterion(input_tensor, target_tensor)
print(f"L1 Loss Value: {loss.item()}") 
# 手动计算验证: (|1-1.5| + |2-2| + |3-4.5| + |4-3| + |5-5| + |6-8|) / 6 
# = (0.5 + 0 + 1.5 + 1.0 + 0 + 2.0) / 6 = 5.0 / 6 ≈ 0.8333

# 4. 反向传播
loss.backward()
print(f"Input Gradients:\n{input_tensor.grad}")
# 梯度应为 +1/6, -1/6 或 0 (取决于 x>y 还是 x<y)
```

---

### 1.2 `nn.MSELoss`

**全称**：Mean Squared Error (L2 Loss)

#### 1.2.1 数学定义
$$
l_n = (x_n - y_n)^2
$$

#### 1.2.2 函数特征
*   **梯度特性**：梯度随误差线性变化 $\frac{\partial l}{\partial x} \propto (x-y)$。误差越大，梯度越大；误差越小，梯度越小。
*   **凸性**：严格凸函数，有唯一的全局最优解。
*   **敏感度**：对异常值**极度敏感**。一个巨大的误差平方后会主导整个 Loss，导致模型过度迁就异常点。

#### 1.2.3 适用场景
*   通用的回归任务。
*   假设噪声服从高斯分布的数据。

#### 1.2.4 注意事项
*   **数值范围**：如果预测值和目标值非常大，平方后可能导致 float32 溢出（NaN）。建议对数据进行标准化（Normalization）。

#### 1.2.5 完整示例
```python
import torch
import torch.nn as nn

input_tensor = torch.randn(2, 3, requires_grad=True)
target_tensor = torch.randn(2, 3)

criterion = nn.MSELoss()
loss = criterion(input_tensor, target_tensor)
loss.backward()

print(f"MSE Loss: {loss.item()}")
# 检查梯度范数
print(f"Gradient Norm: {input_tensor.grad.norm().item()}")
```

---

### 1.3 `nn.HuberLoss`

#### 1.3.1 数学定义
结合了 L1 和 L2 的优点。在误差较小时表现为 MSE（平滑可导），在误差较大时表现为 L1（鲁棒）。

$$
l_n = \begin{cases}
0.5 (x_n - y_n)^2 & \text{if } |x_n - y_n| < \delta \\
\delta (|x_n - y_n| - 0.5 \delta) & \text{otherwise}
\end{cases}
$$

其中 $\delta$ (`delta`) 是阈值参数。

#### 1.3.2 函数特征
*   **平滑性**：在 0 处一阶可导（不像 L1）。
*   **鲁棒性**：大误差区域梯度受限（不像 MSE）。

#### 1.3.3 适用场景
*   回归任务，且数据中可能包含离群点（Outliers）。
*   目标检测中的 Bounding Box 回归（如 Fast R-CNN 早期版本）。

#### 1.3.4 注意事项
*   `delta` 的选择至关重要。通常需要根据数据分布调整。PyTorch 默认 `delta=1.0`。

#### 1.3.5 完整示例
```python
import torch
import torch.nn as nn

x = torch.tensor([0.1, 5.0], requires_grad=True) # 0.1 是小误差, 5.0 是大误差
y = torch.tensor([0.0, 0.0])

criterion = nn.HuberLoss(delta=1.0)
loss = criterion(x, y)

# 验证:
# 第一个元素 |0.1| < 1.0 -> 0.5 * 0.1^2 = 0.005
# 第二个元素 |5.0| >= 1.0 -> 1.0 * (5.0 - 0.5*1.0) = 4.5
# Mean = (0.005 + 4.5) / 2 = 2.2525
print(f"Huber Loss: {loss.item()}")
```

---

### 1.4 `nn.SmoothL1Loss`

**备注**：在 PyTorch 早期版本中广泛使用，数学形式上与 `HuberLoss` 非常相似，但参数化方式略有不同（`beta` 参数）。

#### 1.4.1 数学定义
$$
l_n = \begin{cases}
0.5 (x_n - y_n)^2 / \beta & \text{if } |x_n - y_n| < \beta \\
|x_n - y_n| - 0.5 \beta & \text{otherwise}
\end{cases}
$$

#### 1.4.2 扩展对比
*   **vs HuberLoss**: `SmoothL1Loss` 通常默认 `beta=1.0`。当 `beta=1.0` 且 `delta=1.0` 时，两者等价。推荐在新代码中优先使用 `HuberLoss`，语义更明确。

---

## 2. 分类损失 (Classification Losses)

分类任务涉及离散标签的预测。

### 2.1 `nn.NLLLoss`

**全称**：Negative Log Likelihood Loss

#### 2.1.1 数学定义
$$
\ell(x, y) = L = \{l_1, \dots, l_N\}^\top, \quad l_n = -w_{y_n} x_{n, y_n}
$$
其中 $x$ 是输入，$y$ 是类别索引。注意，$x$ **必须是**对数概率（Log-Probabilities）。

#### 2.1.2 适用场景
*   多分类任务，且模型最后一层已经使用了 `nn.LogSoftmax`。

#### 2.1.3 陷阱与注意事项
*   **输入要求**：新手最容易犯的错误是直接传入 Logits（未归一化的分数）或 Softmax 后的概率。**必须传入 LogSoftmax 的结果**。
*   **数值范围**：输入应该是负数（因为是 log 概率），范围 $(-\infty, 0]$。

---

### 2.2 `nn.CrossEntropyLoss`

**地位**：分类任务的“默认选择”。

#### 2.2.1 数学定义
PyTorch 的 `CrossEntropyLoss` 实际上是 `nn.LogSoftmax` 和 `nn.NLLLoss` 的组合。

$$
\text{loss}(x, class) = -\log\left(\frac{\exp(x[class])}{\sum_j \exp(x[j])}\right) = -x[class] + \log\left(\sum_j \exp(x[j])\right)
$$

#### 2.2.2 函数特征
*   **数值稳定性**：内部使用 Log-Sum-Exp 技巧（`log_softmax`），避免了直接计算 $\exp(x)$ 可能导致的溢出问题。
*   **梯度特性**：$\frac{\partial L}{\partial x_i} = p_i - y_i$（其中 $p$ 是 softmax 概率）。这意味着梯度直接取决于预测概率与真实标签的误差，非常直观且梯度表现良好。

#### 2.2.3 适用场景
*   多分类任务（ImageNet, NLP 分类）。

#### 2.2.4 注意事项
*   **Input Shape**: $(N, C)$ 或 $(N, C, d_1, d_2, \dots)$。
*   **Target Shape**: $(N)$ 或 $(N, d_1, d_2, \dots)$，值为类别的索引 $[0, C-1]$。
*   **Soft Labels**: PyTorch 新版本支持 Target 为概率分布 $(N, C)$，此时计算交叉熵 $H(p, q) = -\sum p(x) \log q(x)$。
*   **`weight` 参数**：处理类别不平衡（Class Imbalance）时的神器。可以给少样本类别赋予更高的权重。

#### 2.2.5 完整示例
```python
import torch
import torch.nn as nn

# 3个样本，5个类别
input_logits = torch.randn(3, 5, requires_grad=True)
# 真实标签索引
target_indices = torch.tensor([1, 0, 4], dtype=torch.long)

# 使用类别权重处理不平衡
class_weights = torch.tensor([1.0, 2.0, 1.0, 1.0, 1.0]) 
criterion = nn.CrossEntropyLoss(weight=class_weights)

loss = criterion(input_logits, target_indices)
loss.backward()

print(f"CE Loss: {loss.item()}")
```

---

### 2.3 `nn.BCELoss` vs `nn.BCEWithLogitsLoss`

这两个用于**二分类**（Binary Classification）或**多标签分类**（Multi-label Classification）。

*   **`nn.BCELoss`**:
    *   **数学定义**: $l_n = - [y_n \cdot \log x_n + (1 - y_n) \cdot \log (1 - x_n)]$
    *   **要求**: 输入 $x$ 必须在 $[0, 1]$ 之间（通常经过 Sigmoid）。
    *   **陷阱**: 如果 $x$ 非常接近 0 或 1，$\log$ 会趋向负无穷，导致数值不稳定。

*   **`nn.BCEWithLogitsLoss` (推荐)**:
    *   **机制**: 内部集成了 Sigmoid + BCELoss。
    *   **优势**: 使用 Log-Sum-Exp 技巧保证数值稳定性。**永远优先使用这个，而不是 Sigmoid + BCELoss**。
    *   **Pos Weight**: 支持 `pos_weight` 参数，专门用于调整正样本的权重，比手动加权更方便。

#### 2.3.5 完整示例 (BCEWithLogitsLoss)
```python
import torch
import torch.nn as nn

# 预测值 (Logits, 不需要 Sigmoid)
logits = torch.randn(3, requires_grad=True)
# 目标值 (Float, 0.0 或 1.0)
targets = torch.empty(3).random_(2)

# pos_weight: 假设正样本很少，给正样本 3倍权重
pos_weight = torch.tensor([3.0])
criterion = nn.BCEWithLogitsLoss(pos_weight=pos_weight)

loss = criterion(logits, targets)
loss.backward()
print(f"BCE With Logits Loss: {loss.item()}")
```

---

### 2.4 多标签与 Margin 损失

*   **`nn.MultiLabelSoftMarginLoss`**:
    *   本质上是 `BCEWithLogitsLoss` 的多标签版本。对每个类别独立计算 BCE，然后取平均。
    *   **适用**: 一张图片可能同时有“猫”和“狗”标签。

*   **`nn.MultiLabelMarginLoss`**:
    *   基于 Hinge Loss 的多标签损失。
    *   $\sum_{j \neq y} \max(0, 1 - (x[y] - x[j]))$
    *   **适用**: 此时关注的是“正类别的得分”要比“负类别的得分”高出一个 Margin。

*   **`nn.SoftMarginLoss`**:
    *   二分类的 Logistic Loss。
    *   $\ell(x, y) = \sum \log(1 + \exp(-y \cdot x))$
    *   **注意**: 这里的 $y$ 应该是 $\{-1, 1\}$ 而不是 $\{0, 1\}$。

---

## 3. 嵌入与排序损失 (Embedding & Ranking Losses)

这类损失函数常用于 Metric Learning（度量学习）、Siamese Network（孪生网络）、Face Recognition（人脸识别）等。

### 3.1 `nn.MarginRankingLoss`

#### 3.1.1 数学定义
给定两个输入 $x_1, x_2$ 和标签 $y \in \{1, -1\}$（1 表示 $x_1$ 排名应高于 $x_2$）：

$$
\text{loss}(x_1, x_2, y) = \max(0, -y \cdot (x_1 - x_2) + \text{margin})
$$

#### 3.1.2 适用场景
*   Learning to Rank（排序学习）。
*   知识图谱嵌入（Knowledge Graph Embedding，如 TransE）。

#### 3.1.3 完整示例
```python
import torch
import torch.nn as nn

# x1 得分, x2 得分
x1 = torch.randn(3, requires_grad=True)
x2 = torch.randn(3, requires_grad=True)
# y=1 意味着 x1 应该 > x2
y = torch.tensor([1, -1, 1]) 

criterion = nn.MarginRankingLoss(margin=0.1)
loss = criterion(x1, x2, y)
loss.backward()
```

---

### 3.2 `nn.CosineEmbeddingLoss`

#### 3.2.1 数学定义
用于学习两个向量是否相似。基于余弦相似度。

$$
\text{loss}(x_1, x_2, y) = \begin{cases}
1 - \cos(x_1, x_2) & \text{if } y = 1 \\
\max(0, \cos(x_1, x_2) - \text{margin}) & \text{if } y = -1
\end{cases}
$$

#### 3.2.2 适用场景
*   文本语义相似度。
*   自监督学习（Self-Supervised Learning）。

#### 3.2.3 坑点
*   **Margin 含义**: 这里的 margin 是针对 $\cos$ 值的。当 $y=-1$（不相似）时，我们希望 $\cos$ 值小于 margin。通常 margin 设为 0.0 到 0.5 之间。

---

### 3.3 `nn.TripletMarginLoss`

**全称**: 三元组损失

#### 3.3.1 数学定义
输入三元组：Anchor ($a$), Positive ($p$), Negative ($n$)。

$$
L(a, p, n) = \max(0, d(a, p) - d(a, n) + \text{margin})
$$

其中 $d(\cdot)$ 通常是 L2 距离。目标是拉近 $(a, p)$，推远 $(a, n)$，且两者距离差至少为 margin。

#### 3.3.2 适用场景
*   人脸识别（FaceNet）。
*   行人重识别（ReID）。

#### 3.3.3 最佳实践
*   **难样本挖掘 (Hard Negative Mining)**: 随机采样的三元组往往很容易满足 margin 条件（Loss=0），导致训练效率低。必须配合在线难样本挖掘策略。

---

## 4. 分布散度与序列损失 (Distribution & Sequence Losses)

### 4.1 `nn.KLDivLoss`

**全称**：Kullback-Leibler Divergence Loss

#### 4.1.1 数学定义
$$
L(y_{\text{pred}}, y_{\text{true}}) = y_{\text{true}} \cdot (\log y_{\text{true}} - y_{\text{pred}})
$$
注意：PyTorch 中的实现与标准数学定义略有不同，它计算的是 $D_{KL}(Q || P) = \sum Q(x) \log \frac{Q(x)}{P(x)} = \sum Q(x) (\log Q(x) - \log P(x))$ 的一部分。

#### 4.1.2 关键陷阱
*   **输入格式**:
    *   `input` ($y_{\text{pred}}$): 必须是 **Log-Probabilities** (LogSoftmax 的输出)。
    *   `target` ($y_{\text{true}}$): 必须是 **Probabilities** (普通的概率分布)。
*   **Reduction**:
    *   `reduction='mean'`: 返回逐元素的平均值（数学上不对应 KL 散度）。
    *   `reduction='batchmean'`: **必须使用这个**，才能得到数学意义上正确的 KL 散度（按 Batch 归一化）。

#### 4.1.3 完整示例
```python
import torch
import torch.nn as nn
import torch.nn.functional as F

# 预测分布 (Logits -> LogSoftmax)
logits = torch.randn(2, 5, requires_grad=True)
input_log_probs = F.log_softmax(logits, dim=1)

# 真实分布 (概率)
target_probs = F.softmax(torch.randn(2, 5), dim=1)

# 必须使用 batchmean
criterion = nn.KLDivLoss(reduction='batchmean')
loss = criterion(input_log_probs, target_probs)

print(f"KL Div Loss: {loss.item()}")
```

---

### 4.2 `nn.CTCLoss`

**全称**: Connectionist Temporal Classification

#### 4.2.1 适用场景
*   序列对序列任务，但输入输出长度不一致且无需对齐。
*   典型应用：**语音识别 (ASR)**、**OCR**。

#### 4.2.2 核心概念
*   引入 `blank` 标签。
*   解决 $X$ (音频帧) 到 $Y$ (文本字符) 的映射，其中 len(X) >> len(Y)。

#### 4.2.3 输入形状注意事项
这是 PyTorch 中最复杂的 Loss 之一。
*   `log_probs`: $(T, N, C)$ —— **注意是 (Time, Batch, Class)**。
*   `targets`: $(N, S)$ 或 1D Tensor。
*   `input_lengths`: $(N)$，每个 batch 中输入的实际长度。
*   `target_lengths`: $(N)$，每个 batch 中目标的实际长度。

---

## 5. 总结与速查表

在选择损失函数时，请遵循以下决策树：

1.  **是回归问题？**
    *   普通回归 $\rightarrow$ `MSELoss`
    *   有异常值 $\rightarrow$ `HuberLoss` / `L1Loss`
2.  **是分类问题？**
    *   二分类 $\rightarrow$ `BCEWithLogitsLoss` (必选)
    *   多分类 $\rightarrow$ `CrossEntropyLoss` (必选)
    *   多标签 $\rightarrow$ `BCEWithLogitsLoss` (One-vs-All)
3.  **是生成/分布匹配？**
    *   $\rightarrow$ `KLDivLoss` / `Wasserstein Loss` (自定义)
4.  **是Embedding学习？**
    *   配对数据 $\rightarrow$ `CosineEmbeddingLoss` / `ContrastiveLoss`
    *   三元组数据 $\rightarrow$ `TripletMarginLoss`

### 附录：PyTorch Loss 速查表

| Loss Function | Input Shape | Target Shape | Activation Required | 典型应用 |
| :--- | :--- | :--- | :--- | :--- |
| `MSELoss` | $(N, *)$ | $(N, *)$ | None | 回归 |
| `L1Loss` | $(N, *)$ | $(N, *)$ | None | 鲁棒回归, GAN |
| `CrossEntropy`| $(N, C)$ | $(N)$ (Index) | None (Logits) | 多分类 |
| `NLLLoss` | $(N, C)$ | $(N)$ (Index) | LogSoftmax | 多分类 |
| `BCEWithLogits`| $(N, *)$ | $(N, *)$ | None (Logits) | 二分类, 多标签 |
| `KLDivLoss` | $(N, *)$ | $(N, *)$ | LogSoftmax | 知识蒸馏, VAE |
| `MarginRanking`| $(N)$ | $(N)$ | None | 排序学习 |
| `TripletMargin`| $(N, D)$ x3 | - | None | 人脸识别, ReID |

---

## 6. 参考文献

1.  [PyTorch Official Documentation: torch.nn](https://pytorch.org/docs/stable/nn.html#loss-functions)
2.  Goodfellow, I., Bengio, Y., & Courville, A. (2016). *Deep Learning*. MIT press.
3.  He, K., Zhang, X., Ren, S., & Sun, J. (2015). Delving deep into rectifiers: Surpassing human-level performance on imagenet classification.
4.  Schroff, F., Kalenichenko, D., & Philbin, J. (2015). Facenet: A unified embedding for face recognition and clustering.

---
*Created by AI Assistant using PyTorch 2.x standards. Last updated: 2026-02-25.*
