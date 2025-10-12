/**
 * Novels API Endpoint
 * Demonstrates fingerprint validation
 */

export default defineEventHandler((event) => {
  // Get fingerprint headers
  const fp = getHeader(event, 'fp')
  const fp1 = getHeader(event, 'fp1')
  const xGuide = getHeader(event, 'x-guide')

  // Log received headers
  console.log('[API] Received headers:', {
    fp: fp ? `${fp.substring(0, 10)}...` : 'missing',
    fp1: fp1 ? 'present' : 'missing',
    xGuide: xGuide ? 'present' : 'missing',
  })

  // Validate fingerprints
  if (!fp || !fp1) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized: Browser fingerprint required',
    })
  }

  // Return demo novels data
  return {
    success: true,
    code: 200,
    message: 'Success',
    data: {
      novels: [
        {
          id: 1,
          title: 'Martial Peak',
          author: 'Momo',
          genre: 'Cultivation',
          chapters: 3000,
          status: 'Ongoing',
          rating: 4.5,
          description: 'The journey to the martial peak is a lonely, solitary and long one.',
        },
        {
          id: 2,
          title: 'Tales of Demons and Gods',
          author: 'Mad Snail',
          genre: 'Fantasy',
          chapters: 500,
          status: 'Ongoing',
          rating: 4.7,
          description: 'Killed by a Sage Emperor, Nie Li returned to his 13-year-old self.',
        },
        {
          id: 3,
          title: 'Solo Leveling',
          author: 'Chugong',
          genre: 'Action',
          chapters: 270,
          status: 'Completed',
          rating: 4.9,
          description: 'E-rank hunter Jinwoo Sung has no money, no talent, and no prospects.',
        },
        {
          id: 4,
          title: 'Reverend Insanity',
          author: 'Gu Zhen Ren',
          genre: 'Cultivation',
          chapters: 2334,
          status: 'Discontinued',
          rating: 4.6,
          description: 'Humans are clever in tens of thousands of ways, Gu are the true refined essences of Heaven and Earth.',
        },
        {
          id: 5,
          title: 'Lord of the Mysteries',
          author: 'Cuttlefish That Loves Diving',
          genre: 'Mystery',
          chapters: 1394,
          status: 'Completed',
          rating: 4.8,
          description: 'In the waves of steam and machinery, who could achieve extraordinary?',
        },
      ],
      pagination: {
        total: 5,
        page: 1,
        pageSize: 10,
      },
      fingerprints: {
        fp: fp.substring(0, 16) + '...',
        fp1_received: true,
      },
    },
  }
})

