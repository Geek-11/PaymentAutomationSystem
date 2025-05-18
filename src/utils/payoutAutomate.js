export const processAutomatedPayouts = async (sessions) => {
  console.log(sessions)
  try {
    // Group sessions by mentor
    const mentorSessions = sessions.reduce((acc, session) => {
      if (session.status === 'Completed') {
        if (!acc[session.mentorId]) {
          acc[session.mentorId] = [];
        }
        acc[session.mentorId].push(session);
      }
      return acc;
    }, {});

    // Process payouts for each mentor
    for (const [mentorId, mentorSessionList] of Object.entries(mentorSessions)) {
      // Get sessions from the last week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const weekSessions = mentorSessionList.filter(session => {
        const sessionDate = new Date(session.sessionDate);
        return sessionDate >= oneWeekAgo;
      });

      if (weekSessions.length > 0) {
        // Generate payout receipt
        const receipt = await generateReceipt({
          mentorId,
          mentorName: weekSessions[0].mentorName,
          periodStart: oneWeekAgo.toISOString(),
          periodEnd: new Date().toISOString(),
          sessionIds: weekSessions.map(s => s.id),
          notes: 'Automated weekly payout'
        });

        // Log receipt generation
        await logAuditEvent(
          generateAuditLog(
            'Automated Payout Generated',
            `Generated automated payout for ${receipt.mentorName}`,
            'System',
            'Payout',
            {
              receiptId: receipt.id,
              mentorId,
              mentorName: receipt.mentorName,
              amount: receipt.totalAmount,
              status: receipt.status,
              sessionCount: weekSessions.length
            }
          )
        );

        if (receipt && receipt.status === 'Pending') {
          // Process bank transfer
          const success = await processBankTransfer(mentorId, receipt.totalAmount);
          
          if (success) {
            // Update receipt status to Paid
            await updateReceiptStatus(receipt.id, 'Paid');

            // Log successful payment
            await logAuditEvent(
              generateAuditLog(
                'Automated Payout Processed',
                `Successfully processed automated payout for ${receipt.mentorName}`,
                'System',
                'Payout',
                {
                  receiptId: receipt.id,
                  mentorId,
                  mentorName: receipt.mentorName,
                  amount: receipt.totalAmount,
                  transferStatus: 'Success'
                }
              )
            );

            // Send confirmation email
            await sendEmail({
              to: `${receipt.mentorName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
              subject: `Weekly Payout Processed - ₹${receipt.totalAmount.toLocaleString()}`,
              body: `
Dear ${receipt.mentorName},

Your weekly payout has been processed and transferred to your bank account.

Period: ${new Date(receipt.periodStart).toLocaleDateString()} to ${new Date(receipt.periodEnd).toLocaleDateString()}
Amount: ₹${receipt.totalAmount.toLocaleString()}

The amount should reflect in your account within 1-2 business days.

Best regards,
PayoutSync Team
              `.trim()
            });
          } else {
            // Log failed payment
            await logAuditEvent(
              generateAuditLog(
                'Automated Payout Failed',
                `Failed to process automated payout for ${receipt.mentorName}`,
                'System',
                'Payout',
                {
                  receiptId: receipt.id,
                  mentorId,
                  mentorName: receipt.mentorName,
                  amount: receipt.totalAmount,
                  transferStatus: 'Failed'
                }
              )
            );
          }
        } else if (receipt && receipt.status === 'UnderReview') {
          // Log review status
          await logAuditEvent(
            generateAuditLog(
              'Payout Under Review',
              `Automated payout for ${receipt.mentorName} requires review`,
              'System',
              'Payout',
              {
                receiptId: receipt.id,
                mentorId,
                mentorName: receipt.mentorName,
                amount: receipt.totalAmount,
                reason: 'Amount exceeds threshold'
              }
            )
          );
        }
      }
    }

    return true;
  } catch (err) {
    console.error('Error processing automated payouts:', err);
    
    // Log automation error
    await logAuditEvent(
      generateAuditLog(
        'Automation Error',
        'Failed to process automated payouts',
        'System',
        'Payout',
        { error: err.message }
      )
    );
    
    return false;
  }
};