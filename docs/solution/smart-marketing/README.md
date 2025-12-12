# 智能营销解决方案

## 1. 智能营销概述

### Q1: 什么是智能营销？它解决了什么问题？
**答：** 智能营销（Smart Marketing）是运用人工智能、大数据分析、机器学习等技术，实现精准用户洞察、个性化推荐、自动化营销和效果优化的现代化营销方式。

解决的问题：
- **用户画像不精准**：传统营销缺乏对用户的深度理解
- **营销内容同质化**：无法提供个性化的产品和服务推荐
- **投放效率低下**：广告投放缺乏精准定向，ROI不高
- **营销时机把握不准**：无法在最佳时机触达用户
- **效果评估困难**：缺乏有效的数据支撑和实时反馈机制

### Q2: 智能营销的核心能力有哪些？
**答：** 智能营销的核心能力包括：

1. **用户洞察**：
   - 360度用户画像构建
   - 用户行为分析和预测
   - 用户分群和标签体系

2. **个性化推荐**：
   - 协同过滤算法
   - 内容推荐系统
   - 实时个性化引擎

3. **精准投放**：
   - 程序化广告投放
   - 多渠道协同投放
   - 动态创意优化

4. **营销自动化**：
   - 营销工作流自动化
   - 智能客服和聊天机器人
   - 生命周期营销管理

5. **效果优化**：
   - A/B测试和多变量测试
   - 实时效果监控
   - ROI优化算法

### Q3: 智能营销的技术架构？
**答：** 智能营销的典型技术架构分为以下几层：

1. **数据层**：
   - 数据采集：用户行为数据、交易数据、第三方数据
   - 数据存储：数据仓库、数据湖、实时数据库
   - 数据处理：ETL、流处理、批处理

2. **平台层**：
   - 用户画像平台：标签体系、人群管理
   - 算法平台：推荐算法、预测模型
   - 营销编排：工作流引擎、任务调度

3. **应用层**：
   - 个性化推荐：商品推荐、内容推荐
   - 精准营销：广告投放、邮件营销
   - 智能客服：聊天机器人、语音助手

4. **交互层**：
   - 营销控制台：可视化配置、效果监控
   - 数据看板：实时报表、趋势分析
   - API接口：系统集成、第三方接入

## 2. 用户画像与标签体系

### Q4: 如何构建360度用户画像？
**答：** 360度用户画像需要整合多维度用户数据：

**用户画像数据维度**：
```python
class UserProfileBuilder:
    def __init__(self):
        self.data_sources = {
            'behavioral': self.collect_behavioral_data,
            'demographic': self.collect_demographic_data,
            'transactional': self.collect_transactional_data,
            'social': self.collect_social_data,
            'psychographic': self.collect_psychographic_data
        }
    
    def build_user_profile(self, user_id):
        """构建完整的用户画像"""
        profile = {
            'basic_info': self._get_basic_info(user_id),
            'behavioral_traits': self._analyze_behavioral_traits(user_id),
            'purchase_patterns': self._analyze_purchase_patterns(user_id),
            'interest_preferences': self._analyze_interests(user_id),
            'lifecycle_stage': self._determine_lifecycle_stage(user_id),
            'value_segment': self._segment_user_value(user_id),
            'risk_profile': self._assess_risk_profile(user_id)
        }
        
        return profile
    
    def _analyze_behavioral_traits(self, user_id):
        """分析行为特征"""
        behaviors = self.collect_behavioral_data(user_id)
        
        return {
            'activity_level': self._calculate_activity_level(behaviors),
            'engagement_score': self._calculate_engagement_score(behaviors),
            'device_preference': self._determine_device_preference(behaviors),
            'channel_affinity': self._analyze_channel_affinity(behaviors),
            'time_patterns': self._analyze_time_patterns(behaviors)
        }
    
    def _analyze_purchase_patterns(self, user_id):
        """分析购买模式"""
        transactions = self.collect_transactional_data(user_id)
        
        return {
            'purchase_frequency': self._calculate_purchase_frequency(transactions),
            'avg_order_value': self._calculate_avg_order_value(transactions),
            'preferred_categories': self._identify_preferred_categories(transactions),
            'seasonal_patterns': self._analyze_seasonal_patterns(transactions),
            'payment_preferences': self._analyze_payment_preferences(transactions)
        }
```

### Q5: 用户标签体系设计？
**答：** 用户标签体系是用户画像的核心组成部分：

**标签分类体系**：
```python
class TagSystem:
    def __init__(self):
        self.tag_categories = {
            'demographics': {
                'age_group': ['18-24', '25-34', '35-44', '45-54', '55+'],
                'gender': ['male', 'female', 'other'],
                'location': ['first_tier_city', 'second_tier_city', 'third_tier_city', 'rural'],
                'education': ['high_school', 'bachelor', 'master', 'phd'],
                'occupation': ['student', 'professional', 'manager', 'entrepreneur', 'retired']
            },
            'behavioral': {
                'activity_level': ['very_active', 'active', 'moderate', 'low', 'inactive'],
                'engagement_type': ['browser', 'buyer', 'reviewer', 'sharer', 'loyal_customer'],
                'visit_frequency': ['daily', 'weekly', 'monthly', 'occasional'],
                'session_duration': ['short', 'medium', 'long'],
                'conversion_likelihood': ['high', 'medium', 'low']
            },
            'transactional': {
                'customer_value': ['vip', 'premium', 'standard', 'potential'],
                'spending_power': ['high', 'medium', 'low'],
                'purchase_frequency': ['frequent', 'regular', 'occasional', 'new'],
                'brand_loyalty': ['loyal', 'switcher', 'explorer'],
                'payment_method': ['credit_card', 'debit_card', 'mobile_payment', 'cash_on_delivery']
            },
            'psychographic': {
                'lifestyle': ['urban_professional', 'family_oriented', 'adventure_seeker', 'homebody'],
                'interests': ['technology', 'fashion', 'sports', 'travel', 'food', 'books'],
                'values': ['quality', 'price', 'convenience', 'brand', 'sustainability'],
                'shopping_style': ['impulse', 'research', 'deal_hunter', 'brand_loyal'],
                'media_consumption': ['social_media', 'traditional_media', 'online_news', 'blogs']
            }
        }
    
    def generate_dynamic_tags(self, user_profile):
        """生成动态标签"""
        dynamic_tags = []
        
        # 基于RFM模型生成标签
        rfm_score = self._calculate_rfm_score(user_profile)
        dynamic_tags.extend(self._rfm_tags(rfm_score))
        
        # 基于行为模式生成标签
        behavioral_score = self._calculate_behavioral_score(user_profile)
        dynamic_tags.extend(self._behavioral_tags(behavioral_score))
        
        # 基于生命周期生成标签
        lifecycle_stage = self._determine_lifecycle_stage(user_profile)
        dynamic_tags.append(f'lifecycle_{lifecycle_stage}')
        
        return dynamic_tags
    
    def _calculate_rfm_score(self, user_profile):
        """计算RFM分数"""
        recency = user_profile['transactional']['days_since_last_purchase']
        frequency = user_profile['transactional']['purchase_frequency']
        monetary = user_profile['transactional']['avg_order_value']
        
        # 标准化评分（1-5分）
        r_score = self._score_recency(recency)
        f_score = self._score_frequency(frequency)
        m_score = self._score_monetary(monetary)
        
        return {'recency': r_score, 'frequency': f_score, 'monetary': m_score}
```

### Q6: 用户分群与细分？
**答：** 用户分群是实现精准营销的基础：

**聚类分析算法**：
```python
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

class UserSegmentation:
    def __init__(self):
        self.scaler = StandardScaler()
        self.clustering_model = None
    
    def segment_users(self, user_features, n_clusters=5):
        """用户分群"""
        # 数据标准化
        scaled_features = self.scaler.fit_transform(user_features)
        
        # K-means聚类
        self.clustering_model = KMeans(n_clusters=n_clusters, random_state=42)
        cluster_labels = self.clustering_model.fit_predict(scaled_features)
        
        # 分析各群体特征
        segments = self._analyze_segments(user_features, cluster_labels)
        
        return {
            'cluster_labels': cluster_labels,
            'segments': segments,
            'model': self.clustering_model
        }
    
    def _analyze_segments(self, features, labels):
        """分析各群体特征"""
        segments = {}
        unique_labels = np.unique(labels)
        
        for label in unique_labels:
            segment_indices = np.where(labels == label)[0]
            segment_features = features[segment_indices]
            
            segments[f'segment_{label}'] = {
                'size': len(segment_indices),
                'percentage': len(segment_indices) / len(features) * 100,
                'characteristics': self._extract_characteristics(segment_features),
                'marketing_strategy': self._suggest_marketing_strategy(label)
            }
        
        return segments
    
    def _extract_characteristics(self, segment_features):
        """提取群体特征"""
        characteristics = {}
        
        # 计算各项指标的均值和标准差
        means = np.mean(segment_features, axis=0)
        stds = np.std(segment_features, axis=0)
        
        characteristics['avg_values'] = means.tolist()
        characteristics['std_deviation'] = stds.tolist()
        characteristics['feature_importance'] = self._calculate_feature_importance(segment_features)
        
        return characteristics
    
    def predict_segment(self, new_user_features):
        """预测新用户所属群体"""
        if self.clustering_model is None:
            raise ValueError("Clustering model not trained yet")
        
        scaled_features = self.scaler.transform([new_user_features])
        predicted_cluster = self.clustering_model.predict(scaled_features)[0]
        
        return predicted_cluster
```

## 3. 个性化推荐系统

### Q7: 推荐算法原理与实现？
**答：** 个性化推荐系统的核心算法包括：

**协同过滤算法**：
```python
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

class CollaborativeFiltering:
    def __init__(self):
        self.user_item_matrix = None
        self.item_similarity_matrix = None
    
    def build_user_item_matrix(self, interactions):
        """构建用户-物品交互矩阵"""
        users = list(set(interaction['user_id'] for interaction in interactions))
        items = list(set(interaction['item_id'] for interaction in interactions))
        
        # 创建用户和物品的索引映射
        user_to_idx = {user: idx for idx, user in enumerate(users)}
        item_to_idx = {item: idx for idx, item in enumerate(items)}
        
        # 初始化矩阵
        matrix = np.zeros((len(users), len(items)))
        
        # 填充交互数据
        for interaction in interactions:
            user_idx = user_to_idx[interaction['user_id']]
            item_idx = item_to_idx[interaction['item_id']]
            matrix[user_idx][item_idx] = interaction['rating']
        
        self.user_item_matrix = matrix
        self.user_to_idx = user_to_idx
        self.item_to_idx = item_to_idx
        self.idx_to_user = {idx: user for user, idx in user_to_idx.items()}
        self.idx_to_item = {idx: item for item, idx in item_to_idx.items()}
        
        return matrix
    
    def compute_item_similarity(self):
        """计算物品相似度矩阵"""
        if self.user_item_matrix is None:
            raise ValueError("User-item matrix not built yet")
        
        # 使用余弦相似度计算物品间相似度
        self.item_similarity_matrix = cosine_similarity(self.user_item_matrix.T)
        
        return self.item_similarity_matrix
    
    def recommend_items_user_based(self, user_id, n_recommendations=10):
        """基于用户的协同过滤推荐"""
        if user_id not in self.user_to_idx:
            return []
        
        user_idx = self.user_to_idx[user_id]
        user_ratings = self.user_item_matrix[user_idx]
        
        # 找到相似用户
        user_similarities = cosine_similarity([user_ratings], self.user_item_matrix)[0]
        
        # 预测评分
        predicted_ratings = np.zeros(self.user_item_matrix.shape[1])
        
        for item_idx in range(self.user_item_matrix.shape[1]):
            if user_ratings[item_idx] == 0:  # 用户未评分的物品
                weighted_sum = 0
                similarity_sum = 0
                
                for other_user_idx in range(self.user_item_matrix.shape[0]):
                    if other_user_idx != user_idx and self.user_item_matrix[other_user_idx][item_idx] > 0:
                        similarity = user_similarities[other_user_idx]
                        rating = self.user_item_matrix[other_user_idx][item_idx]
                        weighted_sum += similarity * rating
                        similarity_sum += abs(similarity)
                
                if similarity_sum > 0:
                    predicted_ratings[item_idx] = weighted_sum / similarity_sum
        
        # 获取推荐物品
        recommended_items = []
        top_indices = np.argsort(predicted_ratings)[::-1][:n_recommendations]
        
        for idx in top_indices:
            if predicted_ratings[idx] > 0:
                recommended_items.append({
                    'item_id': self.idx_to_item[idx],
                    'predicted_rating': predicted_ratings[idx]
                })
        
        return recommended_items
```

**内容推荐算法**：
```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

class ContentBasedRecommender:
    def __init__(self):
        self.tfidf_vectorizer = TfidfVectorizer(stop_words='english')
        self.item_profiles = None
        self.item_similarity_matrix = None
    
    def build_item_profiles(self, items):
        """构建物品内容画像"""
        # 合并物品的各种文本特征
        item_descriptions = []
        for item in items:
            description = f"{item.get('title', '')} {item.get('description', '')} "
            description += ' '.join(item.get('categories', [])) + ' '
            description += ' '.join(item.get('tags', []))
            item_descriptions.append(description)
        
        # 计算TF-IDF向量
        tfidf_matrix = self.tfidf_vectorizer.fit_transform(item_descriptions)
        
        self.item_profiles = tfidf_matrix
        self.items = items
        self.item_ids = [item['id'] for item in items]
        
        return tfidf_matrix
    
    def compute_item_similarity(self):
        """计算物品相似度"""
        if self.item_profiles is None:
            raise ValueError("Item profiles not built yet")
        
        # 计算余弦相似度
        self.item_similarity_matrix = linear_kernel(self.item_profiles, self.item_profiles)
        
        return self.item_similarity_matrix
    
    def recommend_items(self, item_id, n_recommendations=10):
        """基于内容的推荐"""
        if item_id not in self.item_ids:
            return []
        
        # 找到物品索引
        item_idx = self.item_ids.index(item_id)
        
        # 获取相似度分数
        similarity_scores = list(enumerate(self.item_similarity_matrix[item_idx]))
        
        # 按相似度排序
        similarity_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)
        
        # 获取推荐物品
        recommendations = []
        for i, (idx, score) in enumerate(similarity_scores[1:n_recommendations+1]):  # 跳过自己
            if score > 0:
                recommendations.append({
                    'item_id': self.item_ids[idx],
                    'similarity_score': score,
                    'item_info': self.items[idx]
                })
        
        return recommendations
```

### Q8: 实时推荐引擎？
**答：** 实时推荐引擎需要快速响应用户行为变化：

**实时推荐系统架构**：
```python
import redis
import json
from datetime import datetime, timedelta

class RealTimeRecommender:
    def __init__(self, redis_client):
        self.redis = redis_client
        self.cf_recommender = CollaborativeFiltering()
        self.content_recommender = ContentBasedRecommender()
    
    def update_user_behavior(self, user_id, item_id, action, timestamp=None):
        """更新用户行为数据"""
        if timestamp is None:
            timestamp = datetime.now().isoformat()
        
        # 存储用户最近行为
        behavior_key = f"user:{user_id}:recent_behaviors"
        behavior_data = {
            'item_id': item_id,
            'action': action,
            'timestamp': timestamp
        }
        
        # 使用Redis列表存储最近100个行为
        self.redis.lpush(behavior_key, json.dumps(behavior_data))
        self.redis.ltrim(behavior_key, 0, 99)
        
        # 更新用户兴趣标签
        self._update_user_interests(user_id, item_id, action)
        
        # 触发实时推荐计算
        self._trigger_real_time_recommendations(user_id)
    
    def _update_user_interests(self, user_id, item_id, action):
        """更新用户兴趣标签"""
        # 获取物品标签
        item_tags = self._get_item_tags(item_id)
        
        # 根据行为类型调整权重
        weight_multiplier = {
            'view': 1.0,
            'click': 1.5,
            'purchase': 2.0,
            'favorite': 1.8,
            'share': 1.7
        }.get(action, 1.0)
        
        # 更新用户标签权重
        for tag in item_tags:
            tag_key = f"user:{user_id}:tag_weights:{tag}"
            current_weight = float(self.redis.get(tag_key) or 0)
            new_weight = current_weight + (1 * weight_multiplier)
            self.redis.set(tag_key, new_weight)
    
    def get_real_time_recommendations(self, user_id, n_recommendations=10):
        """获取实时推荐"""
        # 检查缓存
        cache_key = f"user:{user_id}:recommendations"
        cached_recommendations = self.redis.get(cache_key)
        
        if cached_recommendations:
            return json.loads(cached_recommendations)
        
        # 计算实时推荐
        recommendations = self._compute_real_time_recommendations(user_id, n_recommendations)
        
        # 缓存结果（5分钟过期）
        self.redis.setex(cache_key, 300, json.dumps(recommendations))
        
        return recommendations
    
    def _compute_real_time_recommendations(self, user_id, n_recommendations):
        """计算实时推荐"""
        # 1. 基于用户最近行为推荐
        recent_items = self._get_recent_interacted_items(user_id, 5)
        
        # 2. 基于用户兴趣标签推荐
        interest_based_items = self._get_interest_based_recommendations(user_id, 5)
        
        # 3. 基于热门物品推荐
        trending_items = self._get_trending_items(5)
        
        # 4. 混合推荐结果
        recommendations = self._merge_recommendations([
            recent_items,
            interest_based_items,
            trending_items
        ], n_recommendations)
        
        return recommendations
    
    def _get_recent_interacted_items(self, user_id, limit):
        """获取最近交互的物品"""
        behavior_key = f"user:{user_id}:recent_behaviors"
        recent_behaviors = self.redis.lrange(behavior_key, 0, limit-1)
        
        item_ids = []
        for behavior_json in recent_behaviors:
            behavior = json.loads(behavior_json)
            # 基于最近交互的物品推荐相似物品
            similar_items = self.content_recommender.recommend_items(
                behavior['item_id'], 3
            )
            item_ids.extend([item['item_id'] for item in similar_items])
        
        return list(set(item_ids))[:limit]
    
    def _get_interest_based_recommendations(self, user_id, limit):
        """基于兴趣的推荐"""
        # 获取用户标签权重
        tag_pattern = f"user:{user_id}:tag_weights:*"
        tag_keys = self.redis.keys(tag_pattern)
        
        weighted_items = {}
        
        for tag_key in tag_keys:
            tag = tag_key.split(':')[-1]
            weight = float(self.redis.get(tag_key) or 0)
            
            # 获取具有该标签的热门物品
            items_with_tag = self._get_items_by_tag(tag, 10)
            
            for item_id in items_with_tag:
                if item_id not in weighted_items:
                    weighted_items[item_id] = 0
                weighted_items[item_id] += weight
        
        # 按权重排序
        sorted_items = sorted(weighted_items.items(), key=lambda x: x[1], reverse=True)
        
        return [item_id for item_id, weight in sorted_items[:limit]]
```

## 4. 精准营销投放

### Q9: 程序化广告投放系统？
**答：** 程序化广告投放系统实现自动化竞价和投放：

**RTB（实时竞价）系统**：
```python
import uuid
from datetime import datetime
from dataclasses import dataclass

@dataclass
class BidRequest:
    auction_id: str
    user_id: str
    device_info: dict
    geo_info: dict
    ad_slot: dict
    timestamp: datetime

@dataclass
class BidResponse:
    auction_id: str
    bid_price: float
    ad_creative: str
    targeting_criteria: dict
    win_notice_url: str

class ProgrammaticAdPlatform:
    def __init__(self):
        self.bidder = RealTimeBidder()
        self.campaign_manager = CampaignManager()
        self.user_profiler = UserProfileBuilder()
        self.ad_server = AdServer()
    
    def handle_bid_request(self, bid_request: BidRequest) -> BidResponse:
        """处理竞价请求"""
        # 1. 用户画像分析
        user_profile = self.user_profiler.get_user_profile(bid_request.user_id)
        
        # 2. 匹配活跃广告活动
        active_campaigns = self.campaign_manager.get_active_campaigns(
            bid_request.ad_slot, user_profile
        )
        
        if not active_campaigns:
            return None  # 无匹配广告
        
        # 3. 计算竞价价格
        winning_campaign = self._select_winning_campaign(
            active_campaigns, user_profile, bid_request
        )
        
        if not winning_campaign:
            return None
        
        # 4. 生成竞价响应
        bid_response = BidResponse(
            auction_id=bid_request.auction_id,
            bid_price=self._calculate_bid_price(winning_campaign, user_profile),
            ad_creative=winning_campaign.creative_id,
            targeting_criteria=winning_campaign.targeting,
            win_notice_url=f"/win_notice/{uuid.uuid4()}"
        )
        
        return bid_response
    
    def _select_winning_campaign(self, campaigns, user_profile, bid_request):
        """选择获胜广告活动"""
        campaign_scores = []
        
        for campaign in campaigns:
            # 计算匹配度分数
            relevance_score = self._calculate_relevance_score(
                campaign.targeting, user_profile, bid_request
            )
            
            # 计算预算充足度
            budget_score = self._calculate_budget_score(campaign)
            
            # 计算历史表现
            performance_score = self._calculate_performance_score(campaign)
            
            # 综合评分
            total_score = (
                relevance_score * 0.5 +
                budget_score * 0.3 +
                performance_score * 0.2
            )
            
            campaign_scores.append((campaign, total_score))
        
        # 选择最高分的广告活动
        if campaign_scores:
            return max(campaign_scores, key=lambda x: x[1])[0]
        
        return None
    
    def _calculate_bid_price(self, campaign, user_profile):
        """计算竞价价格"""
        # 基础出价
        base_bid = campaign.base_bid
        
        # 用户价值调整
        user_value_multiplier = self._calculate_user_value(user_profile)
        
        # 时间因素调整
        time_multiplier = self._calculate_time_factor()
        
        # 竞争对手分析调整
        competition_multiplier = self._analyze_competition(campaign)
        
        final_bid = base_bid * user_value_multiplier * time_multiplier * competition_multiplier
        
        # 确保不超过预算限制
        return min(final_bid, campaign.daily_budget_remaining / 1000)
    
    def handle_win_notification(self, auction_id, winning_price):
        """处理竞价获胜通知"""
        # 记录花费
        self.campaign_manager.record_spend(auction_id, winning_price)
        
        # 更新统计数据
        self._update_campaign_stats(auction_id, winning_price)
        
        # 触发广告展示
        self.ad_server.serve_ad(auction_id)
```

### Q10: 多渠道协同营销？
**答：** 多渠道协同营销实现全触点用户覆盖：

**跨渠道营销编排**：
```python
from enum import Enum
from datetime import datetime, timedelta

class ChannelType(Enum):
    EMAIL = "email"
    SMS = "sms"
    PUSH_NOTIFICATION = "push"
    WECHAT = "wechat"
    DISPLAY_AD = "display_ad"
    SOCIAL_MEDIA = "social_media"

class CrossChannelOrchestrator:
    def __init__(self):
        self.channels = {
            ChannelType.EMAIL: EmailChannel(),
            ChannelType.SMS: SMSChannel(),
            ChannelType.PUSH_NOTIFICATION: PushNotificationChannel(),
            ChannelType.WECHAT: WeChatChannel(),
            ChannelType.DISPLAY_AD: DisplayAdChannel(),
            ChannelType.SOCIAL_MEDIA: SocialMediaChannel()
        }
        self.journey_manager = CustomerJourneyManager()
    
    def create_marketing_journey(self, user_id, campaign_goal, channels_sequence=None):
        """创建跨渠道营销旅程"""
        if channels_sequence is None:
            # 基于用户偏好和行为自动选择渠道
            channels_sequence = self._optimize_channel_sequence(user_id, campaign_goal)
        
        journey = {
            'journey_id': str(uuid.uuid4()),
            'user_id': user_id,
            'goal': campaign_goal,
            'channels': channels_sequence,
            'created_at': datetime.now(),
            'status': 'planned',
            'executed_steps': []
        }
        
        # 保存旅程配置
        self.journey_manager.save_journey(journey)
        
        return journey
    
    def execute_journey_step(self, journey_id, step_index):
        """执行旅程步骤"""
        journey = self.journey_manager.get_journey(journey_id)
        if not journey or step_index >= len(journey['channels']):
            return False
        
        channel_type = journey['channels'][step_index]
        channel = self.channels.get(channel_type)
        
        if not channel:
            return False
        
        # 个性化内容生成
        personalized_content = self._generate_personalized_content(
            journey['user_id'], channel_type, journey['goal']
        )
        
        # 发送消息
        send_result = channel.send_message(
            journey['user_id'], 
            personalized_content,
            journey_id
        )
        
        # 记录执行结果
        execution_record = {
            'step_index': step_index,
            'channel': channel_type,
            'sent_at': datetime.now(),
            'result': send_result,
            'content_preview': personalized_content.get('subject', '')[:50]
        }
        
        self.journey_manager.record_step_execution(journey_id, execution_record)
        
        return send_result.get('success', False)
    
    def _optimize_channel_sequence(self, user_id, campaign_goal):
        """优化渠道序列"""
        user_profile = self._get_user_profile(user_id)
        
        # 基于用户偏好排序渠道
        channel_preferences = user_profile.get('channel_preferences', {})
        
        # 基于营销目标选择渠道
        goal_based_channels = self._channels_for_goal(campaign_goal)
        
        # 结合用户偏好和目标需求排序
        weighted_channels = []
        for channel in goal_based_channels:
            preference_score = channel_preferences.get(channel.value, 0.5)
            goal_relevance = self._channel_goal_relevance(channel, campaign_goal)
            
            total_score = preference_score * 0.6 + goal_relevance * 0.4
            weighted_channels.append((channel, total_score))
        
        # 按分数排序
        sorted_channels = sorted(weighted_channels, key=lambda x: x[1], reverse=True)
        
        return [channel for channel, score in sorted_channels]
    
    def _generate_personalized_content(self, user_id, channel_type, goal):
        """生成个性化内容"""
        user_profile = self._get_user_profile(user_id)
        
        content_templates = {
            ChannelType.EMAIL: self._email_template,
            ChannelType.SMS: self._sms_template,
            ChannelType.PUSH_NOTIFICATION: self._push_template,
            ChannelType.WECHAT: self._wechat_template
        }
        
        template_func = content_templates.get(channel_type)
        if template_func:
            return template_func(user_profile, goal)
        else:
            return {'message': 'Hello!'}
    
    def _email_template(self, user_profile, goal):
        """邮件模板"""
        user_name = user_profile.get('basic_info', {}).get('name', '用户')
        
        if goal == 're_engagement':
            subject = f"{user_name}，我们想念您！回来享受专属优惠"
            body = f"""
            亲爱的{user_name}，
            
            很久没见到您了，我们为您准备了专属回归礼包！
            
            🔥 限时优惠：全场商品8折
            🎁 专属礼品：价值100元优惠券
            🚀 免费配送：订单满299元包邮
            
            点击下方链接立即查看：
            [立即查看优惠](https://example.com/offer)
            
            期待您的回归！
            """
        elif goal == 'upsell':
            subject = f"{user_name}，为您推荐新品"
            body = f"""
            亲爱的{user_name}，
            
            根据您的浏览记录，我们为您精选了几款新品：
            
            🌟 热门推荐
            - [产品A](https://example.com/product-a)
            - [产品B](https://example.com/product-b)
            
            专属优惠：新品首购立减50元！
            
            [立即查看](https://example.com/new-arrivals)
            """
        else:
            subject = "为您精心挑选的内容"
            body = "感谢您的关注！"
        
        return {
            'subject': subject,
            'body': body,
            'personalization_tags': ['user_name', 'recommendations']
        }
```

## 5. 营销自动化

### Q11: 营销工作流引擎？
**答：** 营销工作流引擎实现营销活动的自动化执行：

**可视化工作流设计器**：
```python
from abc import ABC, abstractmethod
from typing import Dict, List, Any
import json

class WorkflowNode(ABC):
    """工作流节点基类"""
    def __init__(self, node_id: str, name: str, config: Dict[str, Any]):
        self.node_id = node_id
        self.name = name
        self.config = config
        self.next_nodes = []
    
    @abstractmethod
    def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        pass
    
    def add_next_node(self, node):
        self.next_nodes.append(node)

class TriggerNode(WorkflowNode):
    """触发器节点"""
    def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        trigger_type = self.config.get('trigger_type')
        trigger_condition = self.config.get('condition')
        
        # 检查触发条件
        if self._check_trigger_condition(trigger_type, trigger_condition, context):
            return {'triggered': True, 'next_nodes': self.next_nodes}
        else:
            return {'triggered': False, 'next_nodes': []}
    
    def _check_trigger_condition(self, trigger_type: str, condition: Dict, context: Dict) -> bool:
        if trigger_type == 'user_behavior':
            user_id = context.get('user_id')
            behavior = context.get('behavior', {})
            
            # 检查用户行为是否符合条件
            return self._match_behavior_condition(behavior, condition)
        elif trigger_type == 'scheduled':
            current_time = datetime.now()
            scheduled_time = condition.get('time')
            
            # 检查是否到达预定时间
            return self._is_scheduled_time(current_time, scheduled_time)
        elif trigger_type == 'data_threshold':
            data_value = context.get('data_value', 0)
            threshold = condition.get('threshold', 0)
            operator = condition.get('operator', 'gt')
            
            # 检查数据阈值条件
            return self._compare_with_threshold(data_value, threshold, operator)
        
        return False

class ActionNode(WorkflowNode):
    """动作节点"""
    def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        action_type = self.config.get('action_type')
        action_params = self.config.get('params', {})
        
        # 执行具体动作
        result = self._execute_action(action_type, action_params, context)
        
        return {
            'action_type': action_type,
            'result': result,
            'next_nodes': self.next_nodes
        }
    
    def _execute_action(self, action_type: str, params: Dict, context: Dict) -> Dict[str, Any]:
        if action_type == 'send_email':
            return self._send_email(params, context)
        elif action_type == 'send_sms':
            return self._send_sms(params, context)
        elif action_type == 'update_user_tag':
            return self._update_user_tag(params, context)
        elif action_type == 'assign_score':
            return self._assign_user_score(params, context)
        elif action_type == 'trigger_webhook':
            return self._trigger_webhook(params, context)
        else:
            return {'success': False, 'error': 'Unknown action type'}

class DecisionNode(WorkflowNode):
    """决策节点"""
    def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        decision_rules = self.config.get('rules', [])
        default_branch = self.config.get('default_branch')
        
        # 评估决策规则
        matched_branch = self._evaluate_decision_rules(decision_rules, context)
        
        if matched_branch:
            next_node = self._get_node_by_branch(matched_branch)
            return {'decision': matched_branch, 'next_nodes': [next_node] if next_node else []}
        else:
            # 使用默认分支
            default_node = self._get_node_by_branch(default_branch)
            return {'decision': 'default', 'next_nodes': [default_node] if default_node else []}
    
    def _evaluate_decision_rules(self, rules: List[Dict], context: Dict) -> str:
        for rule in rules:
            condition = rule.get('condition')
            branch = rule.get('branch')
            
            if self._evaluate_condition(condition, context):
                return branch
        
        return None

class MarketingWorkflowEngine:
    """营销工作流引擎"""
    def __init__(self):
        self.workflows = {}
        self.node_types = {
            'trigger': TriggerNode,
            'action': ActionNode,
            'decision': DecisionNode
        }
    
    def create_workflow(self, workflow_definition: Dict) -> str:
        """创建工作流"""
        workflow_id = workflow_definition.get('id', str(uuid.uuid4()))
        
        # 解析节点定义
        nodes = {}
        for node_def in workflow_definition.get('nodes', []):
            node_type = node_def.get('type')
            node_class = self.node_types.get(node_type)
            
            if node_class:
                node = node_class(
                    node_def.get('id'),
                    node_def.get('name'),
                    node_def.get('config', {})
                )
                nodes[node.node_id] = node
        
        # 建立节点连接关系
        for connection in workflow_definition.get('connections', []):
            from_node_id = connection.get('from')
            to_node_id = connection.get('to')
            
            if from_node_id in nodes and to_node_id in nodes:
                nodes[from_node_id].add_next_node(nodes[to_node_id])
        
        self.workflows[workflow_id] = {
            'definition': workflow_definition,
            'nodes': nodes,
            'status': 'active'
        }
        
        return workflow_id
    
    def execute_workflow(self, workflow_id: str, trigger_context: Dict[str, Any]):
        """执行工作流"""
        workflow = self.workflows.get(workflow_id)
        if not workflow:
            raise ValueError(f"Workflow {workflow_id} not found")
        
        if workflow['status'] != 'active':
            raise ValueError(f"Workflow {workflow_id} is not active")
        
        # 从触发器节点开始执行
        start_nodes = self._find_start_nodes(workflow['nodes'])
        
        execution_context = {
            'workflow_id': workflow_id,
            'start_time': datetime.now(),
            'trigger_context': trigger_context,
            'execution_path': [],
            'variables': {}
        }
        
        # 并行执行所有起始节点
        for start_node in start_nodes:
            self._execute_node(start_node, execution_context)
    
    def _execute_node(self, node: WorkflowNode, context: Dict[str, Any]):
        """执行单个节点"""
        try:
            # 记录执行路径
            context['execution_path'].append({
                'node_id': node.node_id,
                'node_name': node.name,
                'start_time': datetime.now()
            })
            
            # 执行节点
            result = node.execute(context)
            
            # 更新结束时间
            context['execution_path'][-1]['end_time'] = datetime.now()
            context['execution_path'][-1]['result'] = result
            
            # 执行后续节点
            for next_node in result.get('next_nodes', []):
                self._execute_node(next_node, context)
                
        except Exception as e:
            # 记录错误并继续执行其他分支
            context['execution_path'][-1]['error'] = str(e)
            self._log_execution_error(node, context, e)
```

### Q12: 智能客服与聊天机器人？
**答：** 智能客服系统提升用户服务体验：

**对话管理引擎**：
```python
import re
from typing import Dict, List, Tuple
from dataclasses import dataclass

@dataclass
class Intent:
    name: str
    confidence: float
    entities: Dict[str, str]

@dataclass
class DialogState:
    session_id: str
    current_intent: str
    entities: Dict[str, str]
    conversation_history: List[Dict]
    context_variables: Dict[str, Any]

class ChatbotEngine:
    def __init__(self):
        self.intent_classifier = IntentClassifier()
        self.entity_extractor = EntityExtractor()
        self.dialog_manager = DialogManager()
        self.response_generator = ResponseGenerator()
        self.session_store = SessionStore()
    
    def process_user_message(self, session_id: str, user_message: str) -> str:
        """处理用户消息"""
        # 获取会话状态
        dialog_state = self.session_store.get_session(session_id)
        if not dialog_state:
            dialog_state = DialogState(
                session_id=session_id,
                current_intent=None,
                entities={},
                conversation_history=[],
                context_variables={}
            )
        
        # 意图识别
        intent = self.intent_classifier.classify(user_message)
        
        # 实体抽取
        entities = self.entity_extractor.extract(user_message)
        
        # 更新对话状态
        dialog_state = self._update_dialog_state(
            dialog_state, intent, entities, user_message
        )
        
        # 生成回复
        response = self.response_generator.generate(
            intent, entities, dialog_state
        )
        
        # 保存会话状态
        self.session_store.save_session(dialog_state)
        
        return response
    
    def _update_dialog_state(self, state: DialogState, intent: Intent, 
                           entities: Dict[str, str], user_message: str) -> DialogState:
        """更新对话状态"""
        # 更新意图
        if intent.confidence > 0.7:  # 置信度阈值
            state.current_intent = intent.name
        
        # 合并实体
        state.entities.update(entities)
        
        # 更新对话历史
        state.conversation_history.append({
            'turn': len(state.conversation_history) + 1,
            'user_message': user_message,
            'intent': intent.name if intent.confidence > 0.7 else None,
            'entities': entities,
            'timestamp': datetime.now()
        })
        
        # 更新上下文变量
        state = self.dialog_manager.update_context(state, intent, entities)
        
        return state

class IntentClassifier:
    """意图分类器"""
    def __init__(self):
        self.intents = {
            'greeting': [
                r'你好|您好|hi|hello|早上好|下午好|晚上好',
                r'在吗|有人吗'
            ],
            'product_inquiry': [
                r'我想了解.*产品',
                r'.*产品.*怎么样',
                r'有没有.*产品',
                r'.*产品的.*信息'
            ],
            'order_status': [
                r'我的订单.*状态',
                r'订单.*到哪了',
                r'查询订单.*号',
                r'物流信息'
            ],
            'complaint': [
                r'投诉|不满意|问题|坏了|不好',
                r'退款|退货',
                r'客服.*在哪里'
            ],
            'purchase': [
                r'我要买|我想买|购买|下单',
                r'价格.*多少',
                r'怎么付款'
            ]
        }
    
    def classify(self, message: str) -> Intent:
        """分类用户意图"""
        best_intent = None
        best_confidence = 0.0
        
        for intent_name, patterns in self.intents.items():
            for pattern in patterns:
                if re.search(pattern, message, re.IGNORECASE):
                    confidence = self._calculate_confidence(message, pattern)
                    if confidence > best_confidence:
                        best_confidence = confidence
                        best_intent = intent_name
        
        return Intent(
            name=best_intent or 'unknown',
            confidence=best_confidence,
            entities={}
        )
    
    def _calculate_confidence(self, message: str, pattern: str) -> float:
        """计算置信度"""
        # 简单的置信度计算
        match = re.search(pattern, message, re.IGNORECASE)
        if match:
            # 匹配文本越长，置信度越高
            match_length = len(match.group())
            message_length = len(message)
            return min(match_length / message_length, 1.0)
        return 0.0

class ResponseGenerator:
    """回复生成器"""
    def __init__(self):
        self.responses = {
            'greeting': [
                "您好！很高兴为您服务，请问有什么可以帮助您的吗？",
                "您好，欢迎咨询！请问您想了解什么？",
                "Hi！有什么我可以帮您的吗？"
            ],
            'product_inquiry': [
                "关于{product}产品，我可以为您提供详细信息。请问您想了解产品的哪些方面呢？",
                "我们有多款{product}产品，您具体想了解哪一款呢？",
                "让我为您介绍一下{product}产品..."
            ],
            'order_status': [
                "请提供您的订单号，我来帮您查询订单状态。",
                "为了查询您的订单，请告诉我订单号码。",
                "请输入订单号，我马上为您查询物流信息。"
            ],
            'complaint': [
                "非常抱歉给您带来了不便，我会尽力帮您解决问题。",
                "很抱歉听到您遇到了问题，请详细描述一下情况。",
                "我理解您的困扰，让我们一起来解决这个问题。"
            ],
            'purchase': [
                "很高兴您想要购买我们的产品！请问您想了解哪款产品呢？",
                "我们有很多优质的产品可供选择，您有特别感兴趣的商品吗？",
                "购买流程很简单，我可以为您详细介绍。"
            ],
            'unknown': [
                "抱歉，我不太明白您的意思。您可以换个说法或者问我其他问题。",
                "我没有理解您的问题，能否请您再解释得清楚一些？",
                "这个问题我暂时无法回答，已经记录下来会尽快回复您。"
            ]
        }
    
    def generate(self, intent: Intent, entities: Dict[str, str], 
                dialog_state: DialogState) -> str:
        """生成回复"""
        intent_name = intent.name
        possible_responses = self.responses.get(intent_name, self.responses['unknown'])
        
        # 随机选择一个回复模板
        response_template = possible_responses[hash(str(dialog_state.session_id)) % len(possible_responses)]
        
        # 替换模板中的变量
        response = response_template
        for entity_name, entity_value in entities.items():
            response = response.replace(f'{{{entity_name}}}', entity_value)
        
        return response
```

## 6. 效果优化与A/B测试

### Q13: A/B测试框架设计？
**答：** A/B测试框架帮助优化营销效果：

**实验管理平台**：
```python
import hashlib
import random
from datetime import datetime
from typing import Dict, List, Any
from dataclasses import dataclass

@dataclass
class Experiment:
    id: str
    name: str
    description: str
    hypothesis: str
    variants: List[Dict[str, Any]]
    metrics: List[str]
    start_date: datetime
    end_date: datetime
    status: str  # draft, running, completed
    audience_allocation: Dict[str, float]  # variant_id: percentage

@dataclass
class ExperimentResult:
    experiment_id: str
    variant_results: Dict[str, Dict[str, Any]]
    statistical_significance: bool
    winner_variant: str
    confidence_interval: float

class ABTestingFramework:
    def __init__(self):
        self.experiments = {}
        self.event_tracker = EventTracker()
        self.statistics_calculator = StatisticsCalculator()
    
    def create_experiment(self, experiment_config: Dict) -> str:
        """创建A/B测试实验"""
        experiment_id = experiment_config.get('id', str(uuid.uuid4()))
        
        experiment = Experiment(
            id=experiment_id,
            name=experiment_config['name'],
            description=experiment_config.get('description', ''),
            hypothesis=experiment_config.get('hypothesis', ''),
            variants=experiment_config['variants'],
            metrics=experiment_config['metrics'],
            start_date=datetime.fromisoformat(experiment_config['start_date']),
            end_date=datetime.fromisoformat(experiment_config['end_date']),
            status='draft',
            audience_allocation=experiment_config.get('audience_allocation', {})
        )
        
        self.experiments[experiment_id] = experiment
        return experiment_id
    
    def start_experiment(self, experiment_id: str):
        """启动实验"""
        experiment = self.experiments.get(experiment_id)
        if not experiment:
            raise ValueError(f"Experiment {experiment_id} not found")
        
        if experiment.status != 'draft':
            raise ValueError(f"Experiment {experiment_id} is not in draft status")
        
        experiment.status = 'running'
        self._log_experiment_status_change(experiment_id, 'started')
    
    def assign_variant(self, experiment_id: str, user_id: str) -> str:
        """为用户分配实验变体"""
        experiment = self.experiments.get(experiment_id)
        if not experiment or experiment.status != 'running':
            return 'control'  # 默认返回对照组
        
        # 基于用户ID和实验ID生成稳定的哈希值
        hash_input = f"{experiment_id}:{user_id}"
        hash_value = int(hashlib.md5(hash_input.encode()).hexdigest(), 16)
        percentage = (hash_value % 10000) / 100.0  # 0-100之间的百分比
        
        # 根据预设的分配比例分配变体
        cumulative_percentage = 0
        for variant_id, allocation in experiment.audience_allocation.items():
            cumulative_percentage += allocation
            if percentage <= cumulative_percentage:
                return variant_id
        
        return 'control'  # 默认返回对照组
    
    def track_event(self, experiment_id: str, variant_id: str, 
                   user_id: str, event_name: str, event_properties: Dict = None):
        """跟踪实验事件"""
        self.event_tracker.track_event(
            experiment_id=experiment_id,
            variant_id=variant_id,
            user_id=user_id,
            event_name=event_name,
            event_properties=event_properties or {}
        )
    
    def analyze_experiment(self, experiment_id: str) -> ExperimentResult:
        """分析实验结果"""
        experiment = self.experiments.get(experiment_id)
        if not experiment:
            raise ValueError(f"Experiment {experiment_id} not found")
        
        if experiment.status != 'completed':
            raise ValueError(f"Experiment {experiment_id} is not completed yet")
        
        # 获取实验数据
        experiment_data = self.event_tracker.get_experiment_data(experiment_id)
        
        # 计算各变体的指标
        variant_results = {}
        for variant_id in experiment.audience_allocation.keys():
            variant_data = experiment_data.get(variant_id, {})
            variant_results[variant_id] = self._calculate_variant_metrics(
                variant_data, experiment.metrics
            )
        
        # 统计显著性检验
        significance_result = self.statistics_calculator.check_significance(
            variant_results, experiment.metrics
        )
        
        # 确定获胜变体
        winner_variant = self._determine_winner(variant_results, experiment.metrics)
        
        result = ExperimentResult(
            experiment_id=experiment_id,
            variant_results=variant_results,
            statistical_significance=significance_result['significant'],
            winner_variant=winner_variant,
            confidence_interval=significance_result['confidence']
        )
        
        return result
    
    def _calculate_variant_metrics(self, variant_data: Dict, metrics: List[str]) -> Dict[str, Any]:
        """计算变体指标"""
        results = {}
        
        for metric in metrics:
            if metric == 'conversion_rate':
                conversions = len([e for e in variant_data.get('events', []) 
                                 if e['event_name'] == 'conversion'])
                total_visitors = len(set([e['user_id'] for e in variant_data.get('events', [])]))
                results[metric] = conversions / total_visitors if total_visitors > 0 else 0
            
            elif metric == 'revenue_per_visitor':
                total_revenue = sum([e.get('properties', {}).get('revenue', 0) 
                                   for e in variant_data.get('events', [])])
                total_visitors = len(set([e['user_id'] for e in variant_data.get('events', [])]))
                results[metric] = total_revenue / total_visitors if total_visitors > 0 else 0
            
            elif metric == 'click_through_rate':
                clicks = len([e for e in variant_data.get('events', []) 
                            if e['event_name'] == 'click'])
                impressions = len([e for e in variant_data.get('events', []) 
                                 if e['event_name'] == 'impression'])
                results[metric] = clicks / impressions if impressions > 0 else 0
        
        return results
    
    def _determine_winner(self, variant_results: Dict[str, Dict], metrics: List[str]) -> str:
        """确定获胜变体"""
        if not variant_results:
            return 'control'
        
        # 假设第一个指标是最重要的优化目标
        primary_metric = metrics[0] if metrics else 'conversion_rate'
        
        best_variant = 'control'
        best_value = variant_results.get('control', {}).get(primary_metric, 0)
        
        for variant_id, metrics_dict in variant_results.items():
            value = metrics_dict.get(primary_metric, 0)
            if value > best_value:
                best_value = value
                best_variant = variant_id
        
        return best_variant

class StatisticsCalculator:
    """统计计算器"""
    def check_significance(self, variant_results: Dict[str, Dict], 
                          metrics: List[str]) -> Dict[str, Any]:
        """检查统计显著性"""
        if len(variant_results) < 2:
            return {'significant': False, 'confidence': 0.0}
        
        # 简化的显著性检验（实际应用中应使用更复杂的统计方法）
        control_results = variant_results.get('control', {})
        variant_ids = [vid for vid in variant_results.keys() if vid != 'control']
        
        significant = False
        max_confidence = 0.0
        
        for variant_id in variant_ids:
            variant_results_data = variant_results.get(variant_id, {})
            
            # 对每个指标进行检验
            for metric in metrics:
                control_value = control_results.get(metric, 0)
                variant_value = variant_results_data.get(metric, 0)
                
                if control_value > 0:
                    improvement = (variant_value - control_value) / control_value
                    
                    # 简化的置信度计算
                    confidence = self._calculate_simple_confidence(
                        improvement, control_value, variant_value
                    )
                    
                    if confidence > max_confidence:
                        max_confidence = confidence
                    
                    # 如果改善超过5%且置信度超过90%，认为显著
                    if improvement > 0.05 and confidence > 0.9:
                        significant = True
        
        return {
            'significant': significant,
            'confidence': max_confidence
        }
    
    def _calculate_simple_confidence(self, improvement: float, 
                                  control_value: float, variant_value: float) -> float:
        """简化的置信度计算"""
        # 这是一个非常简化的实现，实际应用中应使用统计检验方法
        # 如t检验、卡方检验等
        
        # 基于改善幅度和基准值的简单估算
        base_confidence = min(abs(improvement) * 10, 1.0)  # 改善越大，置信度越高
        value_confidence = min(control_value * 10, 1.0)    # 基准值越大，置信度越高
        
        return (base_confidence + value_confidence) / 2
```

### Q14: 实时效果监控与优化？
**答：** 实时监控系统确保营销活动效果可视化：

**实时监控仪表板**：
```python
import asyncio
import websockets
from datetime import datetime, timedelta
from collections import defaultdict, deque
import json

class RealTimeMonitoringDashboard:
    def __init__(self):
        self.metrics_store = MetricsStore()
        self.alert_manager = AlertManager()
        self.websocket_connections = set()
        self.real_time_processors = {
            'conversion_rate': self._process_conversion_rate,
            'revenue': self._process_revenue,
            'traffic': self._process_traffic,
            'engagement': self._process_engagement
        }
    
    async def start_real_time_monitoring(self):
        """启动实时监控"""
        # 启动WebSocket服务器
        start_server = websockets.serve(self.websocket_handler, "localhost", 8765)
        await start_server
    
    async def websocket_handler(self, websocket, path):
        """WebSocket连接处理器"""
        self.websocket_connections.add(websocket)
        try:
            async for message in websocket:
                # 处理客户端消息
                await self._handle_client_message(websocket, message)
        finally:
            self.websocket_connections.remove(websocket)
    
    async def _handle_client_message(self, websocket, message):
        """处理客户端消息"""
        try:
            data = json.loads(message)
            action = data.get('action')
            
            if action == 'subscribe':
                # 订阅特定指标
                metrics = data.get('metrics', [])
                await self._subscribe_to_metrics(websocket, metrics)
            elif action == 'unsubscribe':
                # 取消订阅
                metrics = data.get('metrics', [])
                await self._unsubscribe_from_metrics(websocket, metrics)
        except json.JSONDecodeError:
            await websocket.send(json.dumps({'error': 'Invalid JSON'}))
    
    async def process_real_time_event(self, event_type: str, event_data: Dict):
        """处理实时事件"""
        # 存储事件数据
        self.metrics_store.store_event(event_type, event_data)
        
        # 处理特定类型的事件
        processor = self.real_time_processors.get(event_type)
        if processor:
            processed_metrics = processor(event_data)
            
            # 检查告警条件
            alerts = self.alert_manager.check_alerts(processed_metrics)
            if alerts:
                await self._broadcast_alerts(alerts)
            
            # 广播实时指标更新
            await self._broadcast_metrics_update(event_type, processed_metrics)
    
    def _process_conversion_rate(self, event_data: Dict) -> Dict:
        """处理转化率指标"""
        # 计算实时转化率
        time_window = timedelta(minutes=5)
        recent_conversions = self.metrics_store.get_events(
            'conversion', 
            datetime.now() - time_window
        )
        recent_visits = self.metrics_store.get_events(
            'visit', 
            datetime.now() - time_window
        )
        
        conversion_rate = (
            len(recent_conversions) / len(recent_visits) * 100 
            if recent_visits else 0
        )
        
        # 计算同比和环比变化
        prev_period_conversions = self.metrics_store.get_events(
            'conversion',
            datetime.now() - time_window * 2,
            datetime.now() - time_window
        )
        prev_period_visits = self.metrics_store.get_events(
            'visit',
            datetime.now() - time_window * 2,
            datetime.now() - time_window
        )
        
        prev_conversion_rate = (
            len(prev_period_conversions) / len(prev_period_visits) * 100
            if prev_period_visits else 0
        )
        
        trend = conversion_rate - prev_conversion_rate
        
        return {
            'current_rate': conversion_rate,
            'previous_rate': prev_conversion_rate,
            'trend': trend,
            'sample_size': len(recent_visits)
        }
    
    def _process_revenue(self, event_data: Dict) -> Dict:
        """处理收入指标"""
        time_window = timedelta(hours=1)
        recent_revenue_events = self.metrics_store.get_events(
            'revenue',
            datetime.now() - time_window
        )
        
        total_revenue = sum(
            event.get('amount', 0) for event in recent_revenue_events
        )
        
        # 计算客单价
        conversion_events = self.metrics_store.get_events(
            'conversion',
            datetime.now() - time_window
        )
        
        avg_order_value = (
            total_revenue / len(conversion_events)
            if conversion_events else 0
        )
        
        return {
            'hourly_revenue': total_revenue,
            'avg_order_value': avg_order_value,
            'transaction_count': len(conversion_events)
        }
    
    async def _broadcast_metrics_update(self, metric_type: str, metrics: Dict):
        """广播指标更新"""
        update_message = {
            'type': 'metrics_update',
            'metric_type': metric_type,
            'data': metrics,
            'timestamp': datetime.now().isoformat()
        }
        
        # 向所有连接的客户端广播
        if self.websocket_connections:
            await asyncio.gather(
                *[conn.send(json.dumps(update_message)) 
                  for conn in self.websocket_connections],
                return_exceptions=True
            )
    
    async def _broadcast_alerts(self, alerts: List[Dict]):
        """广播告警信息"""
        alert_message = {
            'type': 'alerts',
            'data': alerts,
            'timestamp': datetime.now().isoformat()
        }
        
        if self.websocket_connections:
            await asyncio.gather(
                *[conn.send(json.dumps(alert_message))
                  for conn in self.websocket_connections],
                return_exceptions=True
            )

class MetricsStore:
    """指标存储"""
    def __init__(self):
        # 使用内存存储近期数据，生产环境应使用Redis或时序数据库
        self.events = defaultdict(deque)
        self.max_events_per_type = 10000  # 每种事件类型最多存储10000条
    
    def store_event(self, event_type: str, event_data: Dict):
        """存储事件"""
        event_data['timestamp'] = datetime.now()
        self.events[event_type].append(event_data)
        
        # 限制存储数量
        if len(self.events[event_type]) > self.max_events_per_type:
            self.events[event_type].popleft()
    
    def get_events(self, event_type: str, start_time: datetime = None, 
                   end_time: datetime = None) -> List[Dict]:
        """获取事件"""
        events = list(self.events[event_type])
        
        if start_time:
            events = [e for e in events if e['timestamp'] >= start_time]
        
        if end_time:
            events = [e for e in events if e['timestamp'] <= end_time]
        
        return events

class AlertManager:
    """告警管理器"""
    def __init__(self):
        self.alert_rules = [
            {
                'name': 'conversion_rate_drop',
                'metric': 'conversion_rate',
                'condition': lambda x: x['trend'] < -10,  # 转化率下降超过10%
                'severity': 'high',
                'message': '转化率急剧下降，请立即检查！'
            },
            {
                'name': 'revenue_spike',
                'metric': 'revenue',
                'condition': lambda x: x['hourly_revenue'] > 100000,  # 小时收入超过10万
                'severity': 'info',
                'message': '收入创新高！'
            },
            {
                'name': 'low_traffic',
                'metric': 'traffic',
                'condition': lambda x: x['visitors'] < 100,  # 访客数低于100
                'severity': 'medium',
                'message': '流量异常偏低，请检查推广渠道。'
            }
        ]
    
    def check_alerts(self, metrics: Dict) -> List[Dict]:
        """检查告警条件"""
        alerts = []
        
        for rule in self.alert_rules:
            metric_data = metrics.get(rule['metric'])
            if metric_data and rule['condition'](metric_data):
                alerts.append({
                    'rule_name': rule['name'],
                    'severity': rule['severity'],
                    'message': rule['message'],
                    'metric': rule['metric'],
                    'value': metric_data,
                    'timestamp': datetime.now().isoformat()
                })
        
        return alerts
```

## 7. 数据隐私与合规

### Q15: 用户数据保护与隐私合规？
**答：** 确保用户数据安全和隐私合规是智能营销的基础：

**数据隐私保护框架**：
```python
import hashlib
import hmac
from cryptography.fernet import Fernet
from typing import Dict, Any, Optional
import json

class DataPrivacyManager:
    def __init__(self):
        self.encryption_key = self._load_or_generate_key()
        self.cipher_suite = Fernet(self.encryption_key)
        self.consent_manager = ConsentManager()
        self.data_minimizer = DataMinimizer()
    
    def encrypt_sensitive_data(self, data: str) -> str:
        """加密敏感数据"""
        encrypted_data = self.cipher_suite.encrypt(data.encode())
        return encrypted_data.decode()
    
    def decrypt_sensitive_data(self, encrypted_data: str) -> str:
        """解密敏感数据"""
        decrypted_data = self.cipher_suite.decrypt(encrypted_data.encode())
        return decrypted_data.decode()
    
    def anonymize_user_data(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """匿名化用户数据"""
        anonymized_data = user_data.copy()
        
        # 匿名化敏感字段
        sensitive_fields = ['phone', 'email', 'address', 'id_card']
        for field in sensitive_fields:
            if field in anonymized_data:
                anonymized_data[field] = self._anonymize_field(
                    anonymized_data[field]
                )
        
        return anonymized_data
    
    def _anonymize_field(self, value: str) -> str:
        """匿名化单个字段"""
        if '@' in value:  # 邮箱
            parts = value.split('@')
            return f"{parts[0][:2]}***@{parts[1]}"
        elif value.replace('-', '').isdigit():  # 电话号码
            return f"{value[:3]}****{value[-4:]}" if len(value) > 7 else "***"
        else:  # 其他敏感信息
            return hashlib.sha256(value.encode()).hexdigest()[:16]
    
    def process_user_request(self, request_type: str, user_id: str, 
                           request_data: Dict[str, Any] = None) -> Dict[str, Any]:
        """处理用户数据权利请求"""
        if request_type == 'data_access':
            return self._handle_data_access_request(user_id)
        elif request_type == 'data_deletion':
            return self._handle_data_deletion_request(user_id)
        elif request_type == 'data_portability':
            return self._handle_data_portability_request(user_id)
        elif request_type == 'consent_withdrawal':
            return self._handle_consent_withdrawal(user_id, request_data)
        else:
            raise ValueError(f"Unsupported request type: {request_type}")
    
    def _handle_data_access_request(self, user_id: str) -> Dict[str, Any]:
        """处理数据访问请求"""
        # 检查用户同意状态
        consent_status = self.consent_manager.get_user_consent(user_id)
        if not consent_status.get('data_access', False):
            return {
                'success': False,
                'error': 'User has not consented to data access'
            }
        
        # 获取用户数据
        user_data = self._get_user_data(user_id)
        
        # 最小化数据输出
        minimized_data = self.data_minimizer.minimize_for_access(user_data)
        
        return {
            'success': True,
            'data': minimized_data,
            'timestamp': datetime.now().isoformat()
        }
    
    def _handle_data_deletion_request(self, user_id: str) -> Dict[str, Any]:
        """处理数据删除请求"""
        # 检查是否有法律义务保留数据
        if self._has_legal_retention_obligation(user_id):
            return {
                'success': False,
                'error': 'Legal retention obligation prevents deletion'
            }
        
        # 执行数据删除
        deletion_result = self._delete_user_data(user_id)
        
        # 记录删除操作
        self._log_deletion_operation(user_id, deletion_result)
        
        return {
            'success': deletion_result,
            'message': 'User data has been deleted' if deletion_result else 'Deletion failed'
        }
    
    def ensure_compliance(self, marketing_activity: Dict[str, Any]) -> bool:
        """确保营销活动合规"""
        user_id = marketing_activity.get('user_id')
        activity_type = marketing_activity.get('activity_type')
        
        # 检查用户同意状态
        consent_status = self.consent_manager.get_user_consent(user_id)
        
        # 检查特定活动类型的同意
        required_consents = {
            'email_marketing': 'email',
            'sms_marketing': 'sms',
            'personalized_ads': 'targeted_advertising',
            'data_sharing': 'data_sharing'
        }
        
        required_consent = required_consents.get(activity_type)
        if required_consent and not consent_status.get(required_consent, False):
            return False
        
        # 检查数据使用目的
        intended_use = marketing_activity.get('purpose')
        if intended_use and not consent_status.get(f'purpose_{intended_use}', False):
            return False
        
        return True

class ConsentManager:
    """用户同意管理器"""
    def __init__(self):
        self.consent_store = ConsentStore()
    
    def record_user_consent(self, user_id: str, consent_data: Dict[str, Any]) -> bool:
        """记录用户同意"""
        consent_record = {
            'user_id': user_id,
            'consent_data': consent_data,
            'timestamp': datetime.now().isoformat(),
            'version': '1.0'
        }
        
        # 计算同意记录的签名以确保完整性
        consent_record['signature'] = self._sign_consent_record(consent_record)
        
        return self.consent_store.save_consent(consent_record)
    
    def get_user_consent(self, user_id: str) -> Dict[str, Any]:
        """获取用户同意状态"""
        consent_record = self.consent_store.get_latest_consent(user_id)
        if not consent_record:
            return {}
        
        # 验证签名
        if not self._verify_consent_signature(consent_record):
            raise ValueError("Consent record signature verification failed")
        
        return consent_record.get('consent_data', {})
    
    def withdraw_consent(self, user_id: str, consent_types: List[str]) -> bool:
        """撤销用户同意"""
        current_consent = self.get_user_consent(user_id)
        
        # 更新同意状态
        for consent_type in consent_types:
            if consent_type in current_consent:
                current_consent[consent_type] = False
        
        # 记录更新
        return self.record_user_consent(user_id, current_consent)
    
    def _sign_consent_record(self, record: Dict) -> str:
        """对同意记录进行签名"""
        record_copy = record.copy()
        record_copy.pop('signature', None)  # 移除签名字段
        
        record_string = json.dumps(record_copy, sort_keys=True)
        signature = hmac.new(
            b'secret_key_for_signing',  # 实际应用中应使用安全的密钥管理
            record_string.encode(),
            hashlib.sha256
        ).hexdigest()
        
        return signature
    
    def _verify_consent_signature(self, record: Dict) -> bool:
        """验证同意记录签名"""
        original_signature = record.get('signature')
        if not original_signature:
            return False
        
        record_copy = record.copy()
        record_copy.pop('signature', None)
        
        calculated_signature = self._sign_consent_record(record_copy)
        return hmac.compare_digest(original_signature, calculated_signature)

class GDPRComplianceChecker:
    """GDPR合规检查器"""
    def __init__(self):
        self.privacy_manager = DataPrivacyManager()
        self.consent_manager = ConsentManager()
    
    def check_compliance(self, marketing_campaign: Dict[str, Any]) -> Dict[str, Any]:
        """检查GDPR合规性"""
        compliance_report = {
            'compliant': True,
            'violations': [],
            'recommendations': []
        }
        
        # 检查数据处理合法性
        if not self._check_legal_basis(marketing_campaign):
            compliance_report['compliant'] = False
            compliance_report['violations'].append('No legal basis for data processing')
            compliance_report['recommendations'].append('Obtain explicit consent or establish legitimate interest')
        
        # 检查用户同意
        user_id = marketing_campaign.get('target_audience', [{}])[0].get('user_id')
        if user_id:
            consent_status = self.consent_manager.get_user_consent(user_id)
            if not consent_status.get('marketing', False):
                compliance_report['compliant'] = False
                compliance_report['violations'].append('No marketing consent obtained')
                compliance_report['recommendations'].append('Request marketing consent from user')
        
        # 检查数据最小化原则
        if not self._check_data_minimization(marketing_campaign):
            compliance_report['violations'].append('Data minimization principle violated')
            compliance_report['recommendations'].append('Collect only necessary personal data')
        
        # 检查存储期限
        if not self._check_storage_limitation(marketing_campaign):
            compliance_report['violations'].append('Storage limitation principle violated')
            compliance_report['recommendations'].append('Implement data retention policies')
        
        return compliance_report
    
    def _check_legal_basis(self, campaign: Dict[str, Any]) -> bool:
        """检查数据处理的法律依据"""
        legal_bases = campaign.get('legal_basis', [])
        valid_bases = ['consent', 'contract', 'legal_obligation', 'vital_interest', 'public_task', 'legitimate_interest']
        
        return any(basis in valid_bases for basis in legal_bases)
    
    def _check_data_minimization(self, campaign: Dict[str, Any]) -> bool:
        """检查数据最小化原则"""
        collected_data = campaign.get('collected_data', [])
        necessary_data = campaign.get('necessary_data', [])
        
        # 检查收集的数据是否超出必要范围
        return set(collected_data).issubset(set(necessary_data))
    
    def _check_storage_limitation(self, campaign: Dict[str, Any]) -> bool:
        """检查存储期限限制"""
        retention_period = campaign.get('data_retention_period')
        if not retention_period:
            return False
        
        # 检查是否设置了合理的数据保留期限
        max_retention_days = 365 * 3  # 最长3年
        return retention_period <= max_retention_days
```

### Q16: 智能营销平台安全架构？
**答：** 构建安全的智能营销平台架构：

**零信任安全架构**：
```python
import jwt
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import base64
from typing import Dict, List, Optional
import time

class ZeroTrustSecurityFramework:
    def __init__(self):
        self.identity_provider = IdentityProvider()
        self.access_controller = AccessController()
        self.threat_detector = ThreatDetector()
        self.audit_logger = AuditLogger()
    
    def authenticate_user(self, credentials: Dict[str, str]) -> Dict[str, Any]:
        """用户身份认证"""
        # 多因素认证
        auth_result = self.identity_provider.authenticate(credentials)
        
        if not auth_result['success']:
            self.audit_logger.log_authentication_failure(credentials.get('username'))
            return auth_result
        
        # 生成JWT令牌
        token = self._generate_jwt_token(
            auth_result['user_id'],
            auth_result['permissions']
        )
        
        self.audit_logger.log_authentication_success(
            auth_result['user_id'],
            credentials.get('username')
