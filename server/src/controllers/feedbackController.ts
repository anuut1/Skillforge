import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { publishDomainEvent } from '../lib/messaging';

/**
 * Submit feedback on an AI recommendation (e.g., flag as "not relevant", "already know")
 * POST /api/recommendations/feedback
 */
export async function submitRecommendationFeedback(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const {
      recommendationType,
      itemId,
      itemTitle,
      sourcePage,
      reason = 'not_relevant',
      userComment = '',
      metadata = {}
    } = req.body;

    if (!recommendationType || !itemId || !itemTitle || !sourcePage) {
      return res.status(400).json({
        message: 'Missing required fields: recommendationType, itemId, itemTitle, and sourcePage are required.'
      });
    }

    const feedback = await prisma.recommendationFeedback.create({
      data: {
        userId,
        recommendationType,
        itemId: String(itemId),
        itemTitle: String(itemTitle),
        sourcePage,
        reason,
        userComment: userComment || null,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });

    // Fire asynchronous domain event for cloud analytics
    await publishDomainEvent('recommendations', 'RecommendationFlagged', {
      userId,
      feedbackId: feedback.id,
      recommendationType,
      itemId,
      itemTitle,
      sourcePage,
      reason,
    }).catch(() => {});

    res.status(201).json({
      message: 'Feedback recorded successfully. Thank you for helping refine your recommendations.',
      feedback: {
        id: feedback.id,
        recommendationType: feedback.recommendationType,
        itemId: feedback.itemId,
        reason: feedback.reason,
        createdAt: feedback.createdAt
      }
    });
  } catch (error: any) {
    console.error('Error submitting recommendation feedback:', error);
    res.status(500).json({ message: 'Failed to record feedback', error: error.message });
  }
}

/**
 * Get all recommendations flagged by the current user
 * GET /api/recommendations/feedback
 */
export async function getUserRecommendationFeedback(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const feedbackItems = await prisma.recommendationFeedback.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    const parsed = feedbackItems.map(item => ({
      ...item,
      metadata: item.metadata ? JSON.parse(item.metadata) : null
    }));

    res.json(parsed);
  } catch (error: any) {
    console.error('Error fetching recommendation feedback:', error);
    res.status(500).json({ message: 'Failed to retrieve feedback', error: error.message });
  }
}
